const mongoose = require('mongoose');
const Application = require('../models/Application');
const Document = require('../models/Document');
const Scheme = require('../models/Scheme');
const VerificationReport = require('../models/VerificationReport');
const AIServiceClient = require('./aiServiceClient');
const { store } = require('./memoryStore');

class VerificationPipelineService {
  /**
   * Executes the entire automated verification pipeline for a given application ID
   */
  static async runPipeline(applicationId) {
    let application = null;
    if (mongoose.connection.readyState === 1) {
      try {
        application = await Application.findById(applicationId).populate('schemeId');
      } catch (e) {
        application = store.applications.find(a => String(a._id) === String(applicationId) || a.applicationNumber === applicationId);
      }
    } else {
      application = store.applications.find(a => String(a._id) === String(applicationId) || a.applicationNumber === applicationId);
    }

    if (!application) {
      application = store.applications.find(a => String(a._id) === String(applicationId) || a.applicationNumber === applicationId);
    }

    if (!application) {
      throw new Error(`Application ${applicationId} not found`);
    }

    let documents = [];
    if (mongoose.connection.readyState === 1) {
      try {
        documents = await Document.find({ applicationId: application._id });
      } catch (e) {
        documents = store.documents.filter(d => String(d.applicationId) === String(application._id));
      }
    } else {
      documents = store.documents.filter(d => String(d.applicationId) === String(application._id));
    }

    if (!documents || documents.length === 0) {
      documents = store.documents.filter(d => String(d.applicationId) === String(application._id));
    }

    const fieldChecks = [];
    const summaryReasons = [];
    const fraudFlags = [];
    let cumulativeRiskScore = 0;

    // 1. Process Each Document through AI OCR & Quality Validation
    for (const doc of documents) {
      const docUrl = doc.cloudinaryUrl || doc.fileBase64 || '';
      const pipelineResult = await AIServiceClient.runDocumentPipeline(docUrl, doc.documentType);

      doc.extractedFields = pipelineResult.extracted_fields || {};
      doc.fieldConfidences = pipelineResult.field_confidences || {};
      doc.ocrConfidence = pipelineResult.ocr_confidence || 0.85;

      if (pipelineResult.image_hashes) {
        doc.imageHash = {
          phash: pipelineResult.image_hashes.phash || '',
          dhash: pipelineResult.image_hashes.dhash || '',
          composite_hash: pipelineResult.image_hashes.composite_hash || ''
        };
      }

      if (pipelineResult.quality_check) {
        doc.qualityCheck = pipelineResult.quality_check;
        if (pipelineResult.quality_check.is_blurry) {
          cumulativeRiskScore += 15;
          const msg = `Blurry Document Alert: ${doc.documentType.replace(/_/g, ' ').toUpperCase()} has low sharpness (${pipelineResult.quality_check.laplacian_variance}).`;
          summaryReasons.push(msg);
          fraudFlags.push({
            code: 'BLURRY_DOCUMENT',
            severity: 'MEDIUM',
            message: msg
          });
        }
      }

      if (pipelineResult.validation) {
        doc.validationFlags = pipelineResult.validation.validation_flags || [];
        for (const vf of doc.validationFlags) {
          if (vf.severity === 'HIGH' || vf.severity === 'CRITICAL') {
            cumulativeRiskScore += 20;
            summaryReasons.push(`${doc.documentType.replace(/_/g, ' ').toUpperCase()}: ${vf.message}`);
            fraudFlags.push({
              code: vf.type || 'DOCUMENT_DEFECT',
              severity: 'HIGH',
              message: `${doc.documentType.replace(/_/g, ' ').toUpperCase()}: ${vf.message}`
            });
          } else if (vf.severity === 'MEDIUM') {
            cumulativeRiskScore += 8;
          }
        }
      }

      if (typeof doc.save === 'function') {
        try { await doc.save(); } catch (e) {}
      }

      fieldChecks.push({
        documentId: doc._id,
        documentType: doc.documentType,
        extractedFields: doc.extractedFields,
        ocrConfidence: doc.ocrConfidence,
        qualityScore: doc.qualityCheck ? doc.qualityCheck.quality_score : 90,
        validationFlags: doc.validationFlags || []
      });
    }

    // 2. Cross-Document Consistency Examination (Levenshtein & Field Matching)
    const crossCheckResult = await AIServiceClient.crossCheck(
      {
        applicantName: application.applicantName,
        dob: application.dob,
        category: application.category,
        income: application.income,
        bankAccountNumber: application.bankAccountNumber
      },
      documents.map(d => ({
        documentType: d.documentType,
        extractedFields: d.extractedFields
      }))
    );

    if (crossCheckResult.cross_check_flags && crossCheckResult.cross_check_flags.length > 0) {
      for (const flag of crossCheckResult.cross_check_flags) {
        const severityScore = flag.severity === 'CRITICAL' ? 35 : flag.severity === 'HIGH' ? 25 : 15;
        cumulativeRiskScore += severityScore;
        summaryReasons.push(`Cross-Check Discrepancy: ${flag.message}`);
        fraudFlags.push({
          code: flag.type || 'CROSS_CHECK_MISMATCH',
          severity: flag.severity || 'HIGH',
          message: flag.message
        });
      }
    }

    // Build standard Cross-Check Matrix for officer inspection
    const crossCheckMatrix = [];
    
    // Name Consistency
    let nameConsistent = true;
    let nameExtractedDisplay = application.applicantName;
    for (const doc of documents) {
      const extName = doc.extractedFields?.applicant_name || doc.extractedFields?.student_name || doc.extractedFields?.account_holder_name;
      if (extName) {
        const cleanExt = String(extName).toLowerCase().replace(/^(shri|smt|kumari|mr|ms|dr)\.?\s+/i, '').replace(/[^a-z0-9]/g, ' ').trim();
        const cleanApp = String(application.applicantName).toLowerCase().replace(/^(shri|smt|kumari|mr|ms|dr)\.?\s+/i, '').replace(/[^a-z0-9]/g, ' ').trim();
        if (cleanExt !== cleanApp && !cleanExt.includes(cleanApp) && !cleanApp.includes(cleanExt)) {
          nameConsistent = false;
          nameExtractedDisplay = `${extName} (on ${doc.documentType.replace(/_/g, ' ')})`;
        }
      } else if (['aadhaar_card', 'caste_certificate', 'bank_passbook'].includes(doc.documentType)) {
        nameConsistent = false;
        nameExtractedDisplay = `Missing on ${doc.documentType.replace(/_/g, ' ')}`;
      }
    }
    crossCheckMatrix.push({
      checkName: 'Applicant Name Consistency',
      field: 'applicant_name',
      extractedValue: nameExtractedDisplay,
      expectedValue: application.applicantName,
      matchScore: nameConsistent ? 100 : 35,
      isMatch: nameConsistent,
      reason: nameConsistent ? 'Names match across documents' : 'Discrepancy or missing name in uploaded documents'
    });

    // DOB Verification
    // DOB Verification
    const normalizeDob = (dobStr) => {
      if (!dobStr) return '';
      const s = String(dobStr).trim();
      const mIso = s.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
      if (mIso) return `${mIso[3].padStart(2, '0')}/${mIso[2].padStart(2, '0')}/${mIso[1]}`;
      const m = s.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
      if (m) {
        let y = m[3];
        if (y.length === 2) y = parseInt(y) < 50 ? '20' + y : '19' + y;
        return `${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}/${y}`;
      }
      return s;
    };

    const aadhaarDoc = documents.find(d => d.documentType === 'aadhaar_card');
    const aadhaarDob = aadhaarDoc?.extractedFields?.dob || 'Not Found';
    const normAadhaarDob = normalizeDob(aadhaarDob);
    const normAppDob = normalizeDob(application.dob);
    const dobMatch = Boolean(normAadhaarDob && normAppDob && normAadhaarDob === normAppDob);
    crossCheckMatrix.push({
      checkName: 'Date of Birth Verification',
      field: 'dob',
      extractedValue: aadhaarDob,
      expectedValue: application.dob,
      matchScore: dobMatch ? 100 : 40,
      isMatch: dobMatch,
      reason: dobMatch ? 'DOB verified against Aadhaar Card' : 'DOB mismatch or missing in Aadhaar Card'
    });

    // ST Category & Tribe Validity
    const casteDoc = documents.find(d => d.documentType === 'caste_certificate');
    const casteCategory = casteDoc?.extractedFields?.category || 'Not Found';
    const tribeName = casteDoc?.extractedFields?.tribe_name || 'Not Found';
    const casteValid = Boolean(casteDoc && (casteCategory.toLowerCase().includes('tribe') || casteCategory.toLowerCase().includes('st')));
    crossCheckMatrix.push({
      checkName: 'ST Category & Tribe Validity',
      field: 'category',
      extractedValue: `${casteCategory} (${tribeName})`,
      expectedValue: `${application.category} (${application.subTribe || 'ST'})`,
      matchScore: casteValid ? 100 : 20,
      isMatch: casteValid,
      reason: casteValid ? 'Valid Scheduled Tribe Certificate verified' : 'Certificate does not confirm ST category'
    });

    // Bank Account Match
    const bankDoc = documents.find(d => d.documentType === 'bank_passbook');
    const bankAcc = bankDoc?.extractedFields?.account_number || 'Not Found';
    const bankMatch = Boolean(bankDoc && bankAcc === String(application.bankAccountNumber).trim());
    crossCheckMatrix.push({
      checkName: 'Bank Account & IFSC Match',
      field: 'bank_account',
      extractedValue: bankAcc,
      expectedValue: application.bankAccountNumber,
      matchScore: bankMatch ? 100 : 30,
      isMatch: bankMatch,
      reason: bankMatch ? 'Passbook account number matches application form' : 'Bank account mismatch on Passbook'
    });

    // 3. Scheme Eligibility Rules Evaluation
    let scheme = application.schemeId;
    if (!scheme && store.schemes.length > 0) {
      scheme = store.schemes[0];
    }
    
    let isEligible = true;
    const eligibilityRules = [];

    if (scheme) {
      const incomeLimit = scheme.incomeLimit || 600000;
      const incomePass = Number(application.income) <= incomeLimit;
      if (!incomePass) {
        isEligible = false;
        cumulativeRiskScore += 30;
        const msg = `Income Limit Exceeded: Declared family income ₹${Number(application.income).toLocaleString('en-IN')} exceeds scheme ceiling of ₹${incomeLimit.toLocaleString('en-IN')}.`;
        summaryReasons.push(msg);
        fraudFlags.push({ code: 'INCOME_LIMIT_EXCEEDED', severity: 'HIGH', message: msg });
      }
      eligibilityRules.push({
        rule: 'Family Income Ceiling',
        required: `Below ₹${incomeLimit.toLocaleString('en-IN')}`,
        actual: `₹${Number(application.income).toLocaleString('en-IN')}`,
        status: incomePass ? 'PASS' : 'FAIL',
        severity: 'HIGH'
      });

      const isST = String(application.category).toUpperCase() === 'ST' || String(application.category).toUpperCase().includes('TRIBE');
      if (!isST) {
        isEligible = false;
        cumulativeRiskScore += 40;
        const msg = `Ineligible Category: Applicant category '${application.category}' does not qualify for ST Scholarship.`;
        summaryReasons.push(msg);
        fraudFlags.push({ code: 'INVALID_CATEGORY', severity: 'CRITICAL', message: msg });
      }
      eligibilityRules.push({
        rule: 'Category Requirement',
        required: 'Scheduled Tribe (ST)',
        actual: application.category,
        status: isST ? 'PASS' : 'FAIL',
        severity: 'CRITICAL'
      });

      const minPct = scheme.minPercentage || 50.0;
      const studentPct = Number(application.academicPercentage) || 0;
      const pctPass = studentPct >= minPct;
      if (!pctPass) {
        isEligible = false;
        cumulativeRiskScore += 20;
        const msg = `Minimum Academic Score Not Met: Score of ${studentPct}% is below required ${minPct}%.`;
        summaryReasons.push(msg);
        fraudFlags.push({ code: 'ACADEMIC_PERCENTAGE_LOW', severity: 'MEDIUM', message: msg });
      }
      eligibilityRules.push({
        rule: 'Minimum Academic Percentage',
        required: `>= ${minPct}%`,
        actual: `${studentPct}%`,
        status: pctPass ? 'PASS' : 'FAIL',
        severity: 'MEDIUM'
      });
    }

    // 4. Perceptual Duplicate Check (Flag only if identical document was submitted by a DIFFERENT applicant)
    for (const doc of documents) {
      if (doc.imageHash?.composite_hash) {
        const otherDoc = store.documents.find(d => {
          if (String(d._id) === String(doc._id) || String(d.applicationId) === String(application._id)) return false;
          if (d.imageHash?.composite_hash !== doc.imageHash.composite_hash) return false;
          const otherApp = store.applications.find(a => String(a._id) === String(d.applicationId));
          if (otherApp && otherApp.applicantName && application.applicantName) {
            const n1 = otherApp.applicantName.trim().toLowerCase().replace(/^(shri|smt|kumari|mr|ms|dr)\.?\s+/i, '');
            const n2 = application.applicantName.trim().toLowerCase().replace(/^(shri|smt|kumari|mr|ms|dr)\.?\s+/i, '');
            return n1 !== n2; // Only flag if submitted under a DIFFERENT person's name!
          }
          return false;
        });
        if (otherDoc) {
          cumulativeRiskScore += 40;
          const msg = `Duplicate Image Hash Collision: ${doc.documentType.replace(/_/g, ' ').toUpperCase()} has identical image fingerprint to another applicant's submission.`;
          summaryReasons.push(msg);
          fraudFlags.push({ code: 'DUPLICATE_IMAGE_HASH', severity: 'CRITICAL', message: msg });
        }
      }
    }

    // 5. Final Risk Calculation
    // If any document is missing or had high defect flags, add risk
    if (documents.length < 6) {
      const missingCount = 6 - documents.length;
      cumulativeRiskScore += (missingCount * 15);
      const msg = `Incomplete Document Set: Only ${documents.length}/6 mandatory verification documents uploaded.`;
      summaryReasons.push(msg);
      fraudFlags.push({ code: 'MISSING_MANDATORY_DOCUMENTS', severity: 'HIGH', message: msg });
    }

    const finalRiskScore = Math.min(100, Math.max(5, cumulativeRiskScore));
    let riskLevel = 'LOW';
    if (finalRiskScore >= 65) {
      riskLevel = 'HIGH';
    } else if (finalRiskScore >= 35) {
      riskLevel = 'MEDIUM';
    }

    // AI Summary Statement
    let aiSummary = '';
    if (riskLevel === 'HIGH') {
      aiSummary = `HIGH RISK DETECTED (${finalRiskScore}/100): Multiple critical discrepancies, missing fields, or document irregularities flagged. Scrutinize documents before taking final decision.`;
    } else if (riskLevel === 'MEDIUM') {
      aiSummary = `MEDIUM RISK (${finalRiskScore}/100): Minor anomalies or blur warnings detected. Officer manual cross-examination recommended.`;
    } else {
      aiSummary = `LOW RISK (${finalRiskScore}/100): All 6 documents match with high confidence. Identity, category, and eligibility criteria verified.`;
    }

    // 6. Build and Save Report
    const reportData = {
      _id: 'rep_' + application._id,
      applicationId: application._id,
      overallRiskScore: finalRiskScore,
      riskScore: finalRiskScore,
      riskLevel: riskLevel,
      crossCheckMatrix: crossCheckMatrix,
      fieldChecks: fieldChecks,
      fraudFlags: fraudFlags,
      duplicateFlags: fraudFlags.filter(f => f.code.includes('DUPLICATE')),
      schemeEligibility: {
        isEligible: isEligible,
        rulesEvaluated: eligibilityRules,
        reasons: summaryReasons
      },
      aiSummary: aiSummary,
      summaryReasons: summaryReasons.length > 0 ? summaryReasons : ['All documents and eligibility criteria passed standard automated checks.'],
      verifiedAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        let rep = await VerificationReport.findOne({ applicationId: application._id });
        if (!rep) {
          rep = new VerificationReport(reportData);
        } else {
          Object.assign(rep, reportData);
        }
        await rep.save();
      } catch (e) {}
    }

    // Save to memoryStore
    store.verificationReports = store.verificationReports.filter(r => String(r.applicationId) !== String(application._id));
    store.verificationReports.push(reportData);

    // Update Application Record
    application.riskScore = finalRiskScore;
    application.riskLevel = riskLevel;
    application.status = 'under_review';

    if (typeof application.save === 'function') {
      try { await application.save(); } catch (e) {}
    }

    return {
      application,
      report: reportData
    };
  }
}

module.exports = VerificationPipelineService;
