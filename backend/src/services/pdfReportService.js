const PDFDocument = require('pdfkit');

class PDFReportService {
  /**
   * Generates a government-grade PDF verification report and pipes to response stream
   */
  static generateReportPDF(application, report, res) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // Set HTTP headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="SatyaPatra_Report_${application.applicationNumber}.pdf"`
    );

    doc.pipe(res);

    // --- Header Section ---
    doc
      .fillColor('#0f172a')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('GOVERNMENT OF INDIA — MINISTRY OF TRIBAL AFFAIRS', { align: 'center' });

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#475569')
      .text('SatyaPatra AI: Automated ST Scholarship Document Verification Dossier', { align: 'center' });

    doc.moveDown(0.5);
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.8);

    // --- Summary & Risk Badge ---
    const riskLevel = report.riskLevel || 'LOW';
    const riskScore = report.riskScore || 0;
    const badgeColor = riskLevel === 'HIGH' ? '#dc2626' : riskLevel === 'MEDIUM' ? '#d97706' : '#16a34a';

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#0f172a')
      .text(`Application Number: ${application.applicationNumber}`, 40, doc.y);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#64748b')
      .text(`Generated At: ${new Date(report.generatedAt || Date.now()).toLocaleString('en-IN')}`);

    doc.moveDown(0.5);

    // Draw Risk Score Box
    const boxY = doc.y;
    doc.rect(40, boxY, 515, 45).fillAndStroke('#f8fafc', '#e2e8f0');
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor(badgeColor)
      .text(`RISK EVALUATION: ${riskLevel} RISK (Score: ${riskScore}/100)`, 55, boxY + 12);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#334155')
      .text(`Status: ${application.status.toUpperCase()} | Decision: ${application.officerDecision?.decision || 'PENDING REVIEW'}`, 55, boxY + 28);

    doc.y = boxY + 55;
    doc.moveDown(0.5);

    // --- Applicant Details Grid ---
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e293b')
      .text('1. APPLICANT & SCHEME PROFILE');
    doc.moveDown(0.3);

    const schemeName = application.schemeId?.name || 'National Fellowship for ST Students';
    const details = [
      ['Applicant Name:', application.applicantName, 'Category / Tribe:', `${application.category} (${application.subTribe || 'ST'})`],
      ['Date of Birth:', application.dob, 'Aadhaar (Masked):', application.aadhaarNumberMasked],
      ['Annual Income:', `Rs. ${application.income?.toLocaleString('en-IN')}`, 'Academic Score:', `${application.academicPercentage || 75}%`],
      ['Degree / Course:', application.course, 'Institution:', application.institution],
      ['Bank Account:', `****${(application.bankAccountNumber || '').slice(-4)} (${application.ifscCode})`, 'Scholarship Scheme:', schemeName]
    ];

    doc.fontSize(9).font('Helvetica');
    details.forEach(row => {
      const y = doc.y;
      doc.font('Helvetica-Bold').fillColor('#475569').text(row[0], 45, y, { width: 110 });
      doc.font('Helvetica').fillColor('#0f172a').text(row[1], 155, y, { width: 140 });
      doc.font('Helvetica-Bold').fillColor('#475569').text(row[2], 300, y, { width: 110 });
      doc.font('Helvetica').fillColor('#0f172a').text(row[3], 410, y, { width: 140 });
      doc.moveDown(0.4);
    });

    doc.moveDown(0.8);

    // --- Eligibility Rules Table ---
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e293b')
      .text('2. SCHEME ELIGIBILITY EVALUATION');
    doc.moveDown(0.3);

    const rules = report.eligibilityResults?.rulesEvaluated || [];
    rules.forEach(r => {
      const isPass = r.status === 'PASS';
      const statusColor = isPass ? '#16a34a' : '#dc2626';
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor('#334155')
        .text(`• ${r.rule}: `, { continued: true })
        .font('Helvetica')
        .fillColor('#64748b')
        .text(`Required: ${r.required} | Actual: ${r.actual}  ->  `, { continued: true })
        .font('Helvetica-Bold')
        .fillColor(statusColor)
        .text(`[${r.status}]`);
    });

    doc.moveDown(0.8);

    // --- Key Flagged Reasons & Findings ---
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e293b')
      .text('3. AI VERIFICATION FINDINGS & EXPLANATION');
    doc.moveDown(0.3);

    const reasons = report.summaryReasons || [];
    if (reasons.length === 0) {
      doc.fontSize(9).font('Helvetica').fillColor('#16a34a').text('• No critical discrepancies or duplicate flags detected.');
    } else {
      reasons.forEach(r => {
        doc.fontSize(9).font('Helvetica').fillColor('#991b1b').text(`• ${r}`);
      });
    }

    doc.moveDown(0.8);

    // --- Officer Decision & Sign-off Block ---
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e293b')
      .text('4. VERIFICATION OFFICER SIGN-OFF');
    doc.moveDown(0.3);

    const dec = application.officerDecision || {};
    const decY = doc.y;
    doc.rect(40, decY, 515, 65).fillAndStroke('#f1f5f9', '#cbd5e1');

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#0f172a')
      .text(`Decision: ${dec.decision || 'PENDING'}`, 55, decY + 10);

    doc
      .font('Helvetica')
      .fillColor('#334155')
      .text(`Officer Name: ${dec.officerName || 'Assigned Officer'}`, 55, decY + 24);

    doc
      .text(`Officer Remarks: ${dec.comment || 'Awaiting officer examination and signature.'}`, 55, decY + 38, { width: 330 });

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#64748b')
      .text('OFFICER DIGITAL SIGNATURE', 400, decY + 45, { align: 'right' });

    // End Document
    doc.end();
  }
}

module.exports = PDFReportService;
