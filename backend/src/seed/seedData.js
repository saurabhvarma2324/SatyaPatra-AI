const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');
const Document = require('../models/Document');
const VerificationReport = require('../models/VerificationReport');
const AuditLog = require('../models/AuditLog');

// Helper to create synthetic document image base64
const createSampleDocDataUri = (title, fields) => {
  const fieldLines = Object.entries(fields)
    .map(([k, v]) => `<text x="50" y="${120 + Object.keys(fields).indexOf(k) * 35}" font-family="Arial, sans-serif" font-size="16" fill="#1e293b"><tspan font-weight="bold">${k.toUpperCase()}:</tspan> ${v}</text>`)
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
  <rect x="20" y="20" width="760" height="560" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="20" y="20" width="760" height="60" fill="#1e3a8a"/>
  <text x="400" y="55" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">GOVERNMENT OF INDIA / STATE AUTHORITY</text>
  <text x="400" y="95" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">${title.toUpperCase()}</text>
  <line x1="50" y1="105" x2="750" y2="105" stroke="#cbd5e1" stroke-width="2"/>
  ${fieldLines}
  <rect x="580" y="460" width="170" height="90" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="4"/>
  <text x="665" y="510" font-family="Arial, sans-serif" font-size="12" fill="#475569" text-anchor="middle">OFFICIAL SEAL / SIGN</text>
</svg>`;

  const b64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${b64}`;
};

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains records. Skipping seed.');
      return;
    }

    console.log('--- Initializing SatyaPatra AI Seed Data ---');

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Password@123', salt);

    const officerUser = await User.create({
      name: 'Dr. Rameshwar Oraon',
      email: 'officer@satyapatra.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'officer',
      designation: 'Senior Verification Officer (ST Welfare)',
      department: 'Ministry of Tribal Affairs, Govt. of India'
    });

    const adminUser = await User.create({
      name: 'Chief Admin Sentinel',
      email: 'admin@satyapatra.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      designation: 'System Administrator & Scheme Director',
      department: 'National Tribal Informatics Center'
    });

    const applicantUser = await User.create({
      name: 'Birsa Munda',
      email: 'applicant@satyapatra.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'applicant',
      designation: 'Student / Fellowship Applicant',
      department: 'Tribal Higher Education'
    });

    console.log('✔ Users seeded (officer@satyapatra.gov.in, admin@satyapatra.gov.in)');

    // 2. Seed Schemes
    const nfstScheme = await Scheme.create({
      name: 'National Fellowship and Scholarship for Higher Education of ST Students (NFST)',
      code: 'NFST-2026',
      description: 'Central sector scheme providing full financial support to ST students pursuing M.Phil/Ph.D. and graduate professional degrees in Top Class Institutes.',
      category: 'ST',
      incomeLimit: 600000,
      minPercentage: 60.0,
      approvedCourses: ['B.Tech in Computer Science', 'M.Tech', 'Ph.D. in Tribal Studies', 'MBBS', 'MBA'],
      approvedInstitutions: ['IIT Bombay', 'NIT Jamshedpur', 'Ranchi University', 'AIIMS New Delhi', 'IIM Ahmedabad'],
      isActive: true
    });

    const pmsScheme = await Scheme.create({
      name: 'Post-Matric Scholarship for Scheduled Tribe Students (PMS-ST)',
      code: 'PMS-ST-2026',
      description: 'Centrally sponsored scholarship scheme assisting ST students studying at post-matriculation or post-secondary stages.',
      category: 'ST',
      incomeLimit: 250000,
      minPercentage: 50.0,
      approvedCourses: ['B.A. Political Science', 'B.Sc Physics', 'B.Com', 'Diploma in Engineering'],
      approvedInstitutions: ['St. Xaviers College Ranchi', 'Marwari College', 'Govt Polytechnic Ranchi'],
      isActive: true
    });

    const tcesScheme = await Scheme.create({
      name: 'Top Class Education Scheme for ST Students',
      code: 'TCES-ST-2026',
      description: 'Assisting meritorious ST students securing admission in notified institutions of excellence across India.',
      category: 'ST',
      incomeLimit: 600000,
      minPercentage: 65.0,
      approvedCourses: ['B.Tech', 'MBBS', 'B.Arch', 'LL.B.'],
      approvedInstitutions: ['IIT Delhi', 'IIT Kharagpur', 'NIT Rourkela', 'NLU Bangalore'],
      isActive: true
    });

    console.log('✔ Schemes seeded (NFST, PMS-ST, TCES-ST)');

    // 3. Seed Sample Applications

    // --- APPLICATION 1: Birsa Munda (Clean Genuine Case) ---
    const app1Aadhaar = '543298761234';
    const app1AadhaarHash = crypto.createHash('sha256').update(app1Aadhaar).digest('hex');
    const app1 = await Application.create({
      applicationNumber: 'ST-2026-10492',
      applicantName: 'Birsa Munda',
      dob: '15/08/2002',
      gender: 'Male',
      category: 'ST',
      subTribe: 'Munda',
      aadhaarNumberMasked: 'XXXX-XXXX-1234',
      aadhaarHash: app1AadhaarHash,
      income: 120000,
      course: 'B.Tech in Computer Science',
      institution: 'National Institute of Technology (NIT) Jamshedpur',
      academicPercentage: 78.5,
      bankAccountNumber: '389201948102',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India',
      schemeId: nfstScheme._id,
      status: 'under_review',
      riskScore: 10,
      riskLevel: 'LOW',
      submittedAt: new Date(Date.now() - 3 * 86400000)
    });

    // Create App 1 Documents
    const app1CasteDoc = await Document.create({
      applicationId: app1._id,
      documentType: 'caste_certificate',
      originalFileName: 'caste_certificate_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Scheduled Tribe Certificate', {
        'Applicant Name': 'Birsa Munda',
        'Father Name': 'Sugana Munda',
        'Category': 'Scheduled Tribe (ST)',
        'Tribe': 'Munda',
        'Issuing Authority': 'Sub-Divisional Officer (SDO)',
        'Certificate No': 'ST/JH/2024/00819',
        'Date of Issue': '14/06/2023'
      }),
      cloudinaryPublicId: 'local_caste_birsa',
      imageHash: { phash: 'a1b2c3d4e5f60718', dhash: '1807f6e5d4c3b2a1', composite_hash: 'a1b2c3d4e5f60718_1807f6e5d4c3b2a1' },
      extractedFields: {
        applicant_name: 'Birsa Munda',
        father_name: 'Sugana Munda',
        category: 'Scheduled Tribe',
        tribe_name: 'Munda',
        issuing_authority: 'Sub-Divisional Officer (SDO)',
        certificate_number: 'ST/JH/2024/00819',
        issue_date: '14/06/2023'
      },
      ocrConfidence: 0.94,
      qualityCheck: { qualityScore: 96, laplacianVariance: 154.2, isBlurry: false }
    });

    const app1IncomeDoc = await Document.create({
      applicationId: app1._id,
      documentType: 'income_certificate',
      originalFileName: 'income_certificate_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Annual Income Certificate', {
        'Applicant Name': 'Birsa Munda',
        'Annual Income': 'Rs. 1,20,000 (One Lakh Twenty Thousand)',
        'Issuing Authority': 'Circle Officer / Tahsildar Ranchi',
        'Certificate No': 'INC/JH/2024/09321',
        'Date of Issue': '10/05/2024'
      }),
      cloudinaryPublicId: 'local_income_birsa',
      imageHash: { phash: 'b2c3d4e5f60718a1', dhash: '2908f6e5d4c3b2b2', composite_hash: 'b2c3d4e5f60718a1_2908f6e5d4c3b2b2' },
      extractedFields: {
        applicant_name: 'Birsa Munda',
        annual_income: 120000,
        issuing_authority: 'Tahsildar Ranchi',
        certificate_number: 'INC/JH/2024/09321',
        issue_date: '10/05/2024'
      },
      ocrConfidence: 0.93,
      qualityCheck: { qualityScore: 94, laplacianVariance: 142.1, isBlurry: false }
    });

    const app1AadhaarDoc = await Document.create({
      applicationId: app1._id,
      documentType: 'aadhaar_card',
      originalFileName: 'aadhaar_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Unique Identification Authority of India', {
        'Name': 'Birsa Munda',
        'DOB': '15/08/2002',
        'Gender': 'Male',
        'Aadhaar No': 'XXXX-XXXX-1234'
      }),
      cloudinaryPublicId: 'local_aadhaar_birsa',
      imageHash: { phash: 'c3d4e5f60718a1b2', dhash: '3908f6e5d4c3b2c3', composite_hash: 'c3d4e5f60718a1b2_3908f6e5d4c3b2c3' },
      extractedFields: {
        applicant_name: 'Birsa Munda',
        dob: '15/08/2002',
        gender: 'Male',
        aadhaar_number: '543298761234',
        aadhaar_masked: 'XXXX-XXXX-1234'
      },
      ocrConfidence: 0.97,
      qualityCheck: { qualityScore: 98, laplacianVariance: 180.5, isBlurry: false }
    });

    const app1MarkSheetDoc = await Document.create({
      applicationId: app1._id,
      documentType: 'mark_sheet',
      originalFileName: 'marksheet_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Academic Mark Sheet', {
        'Student Name': 'Birsa Munda',
        'Roll No': '2023-BTECH-9014',
        'Percentage': '78.5%',
        'Institution': 'NIT Jamshedpur',
        'Year': '2023'
      }),
      cloudinaryPublicId: 'local_marks_birsa',
      imageHash: { phash: 'd4e5f60718a1b2c3', dhash: '4908f6e5d4c3b2d4', composite_hash: 'd4e5f60718a1b2c3_4908f6e5d4c3b2d4' },
      extractedFields: {
        student_name: 'Birsa Munda',
        roll_number: '2023-BTECH-9014',
        percentage_cgpa: 78.5,
        board_university: 'NIT Jamshedpur',
        passing_year: '2023'
      },
      ocrConfidence: 0.92,
      qualityCheck: { qualityScore: 95, laplacianVariance: 148.0, isBlurry: false }
    });

    const app1BankDoc = await Document.create({
      applicationId: app1._id,
      documentType: 'bank_passbook',
      originalFileName: 'bank_passbook_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('State Bank of India Passbook', {
        'Account Holder': 'Birsa Munda',
        'Account Number': '389201948102',
        'IFSC Code': 'SBIN0001234',
        'Branch': 'Ranchi Main Branch'
      }),
      cloudinaryPublicId: 'local_bank_birsa',
      imageHash: { phash: 'e5f60718a1b2c3d4', dhash: '5908f6e5d4c3b2e5', composite_hash: 'e5f60718a1b2c3d4_5908f6e5d4c3b2e5' },
      extractedFields: {
        account_holder_name: 'Birsa Munda',
        account_number: '389201948102',
        ifsc_code: 'SBIN0001234',
        bank_name: 'State Bank of India',
        branch: 'Ranchi Main Branch'
      },
      ocrConfidence: 0.95,
      qualityCheck: { qualityScore: 96, laplacianVariance: 160.2, isBlurry: false }
    });

    // Verification Report for App 1
    await VerificationReport.create({
      applicationId: app1._id,
      riskScore: 10,
      riskLevel: 'LOW',
      fieldChecks: [
        { documentType: 'caste_certificate', ocrConfidence: 0.94, qualityScore: 96, validationFlags: [] },
        { documentType: 'income_certificate', ocrConfidence: 0.93, qualityScore: 94, validationFlags: [] },
        { documentType: 'aadhaar_card', ocrConfidence: 0.97, qualityScore: 98, validationFlags: [] },
        { documentType: 'mark_sheet', ocrConfidence: 0.92, qualityScore: 95, validationFlags: [] },
        { documentType: 'bank_passbook', ocrConfidence: 0.95, qualityScore: 96, validationFlags: [] }
      ],
      crossDocumentChecks: {
        consistencyScore: 100,
        nameComparisons: [
          { documentType: 'caste_certificate', extractedName: 'Birsa Munda', targetName: 'Birsa Munda', similarityScore: 100, isMatch: true },
          { documentType: 'aadhaar_card', extractedName: 'Birsa Munda', targetName: 'Birsa Munda', similarityScore: 100, isMatch: true },
          { documentType: 'mark_sheet', extractedName: 'Birsa Munda', targetName: 'Birsa Munda', similarityScore: 100, isMatch: true },
          { documentType: 'bank_passbook', extractedName: 'Birsa Munda', targetName: 'Birsa Munda', similarityScore: 100, isMatch: true }
        ],
        dobComparisons: [{ documentType: 'aadhaar_card', extractedDob: '15/08/2002', applicationDob: '15/08/2002', isMatch: true }],
        categoryComparisons: [{ documentType: 'caste_certificate', extractedCategory: 'Scheduled Tribe', isMatch: true }],
        bankComparisons: [{ documentType: 'bank_passbook', extractedAccount: '389201948102', isMatch: true }],
        crossCheckFlags: []
      },
      duplicateFlags: [],
      eligibilityResults: {
        isEligible: true,
        overallStatus: 'ELIGIBLE',
        rulesEvaluated: [
          { rule: 'Family Income Ceiling', required: 'Below ₹6,00,000', actual: '₹1,20,000', status: 'PASS' },
          { rule: 'Category Requirement', required: 'Scheduled Tribe (ST)', actual: 'ST', status: 'PASS' },
          { rule: 'Minimum Academic Percentage', required: '>= 60.0%', actual: '78.5%', status: 'PASS' },
          { rule: 'Approved Degree Course', required: 'Recognized Course List', actual: 'B.Tech in Computer Science', status: 'PASS' }
        ]
      },
      summaryReasons: ['All documents and eligibility criteria passed standard automated checks.']
    });

    // --- APPLICATION 2: Rani Kerketta (High Risk: Exceeded Income + Name Mismatch) ---
    const app2Aadhaar = '987654321098';
    const app2AadhaarHash = crypto.createHash('sha256').update(app2Aadhaar).digest('hex');
    const app2 = await Application.create({
      applicationNumber: 'ST-2026-30291',
      applicantName: 'Rani Kerketta',
      dob: '22/11/2003',
      gender: 'Female',
      category: 'ST',
      subTribe: 'Oraon',
      aadhaarNumberMasked: 'XXXX-XXXX-1098',
      aadhaarHash: app2AadhaarHash,
      income: 650000, // Exceeds PMS-ST limit of ₹2,50,000
      course: 'B.A. Political Science',
      institution: 'St. Xaviers College Ranchi',
      academicPercentage: 54.0,
      bankAccountNumber: '492019481093',
      ifscCode: 'PUNB0192000',
      bankName: 'Punjab National Bank',
      schemeId: pmsScheme._id,
      status: 'under_review',
      riskScore: 85,
      riskLevel: 'HIGH',
      submittedAt: new Date(Date.now() - 2 * 86400000)
    });

    // Create App 2 Documents (with intentional Name mismatch on Marksheet)
    await Document.create({
      applicationId: app2._id,
      documentType: 'caste_certificate',
      originalFileName: 'caste_rani.png',
      cloudinaryUrl: createSampleDocDataUri('Scheduled Tribe Certificate', {
        'Applicant Name': 'Rani Kerketta',
        'Category': 'Scheduled Tribe (ST)',
        'Tribe': 'Oraon',
        'Certificate No': 'ST/JH/2024/77210'
      }),
      cloudinaryPublicId: 'local_caste_rani',
      imageHash: { phash: 'f60718a1b2c3d4e5', dhash: '6908f6e5d4c3b2f6', composite_hash: 'f60718a1b2c3d4e5_6908f6e5d4c3b2f6' },
      extractedFields: { applicant_name: 'Rani Kerketta', category: 'Scheduled Tribe', tribe_name: 'Oraon', certificate_number: 'ST/JH/2024/77210' },
      ocrConfidence: 0.92,
      qualityCheck: { qualityScore: 92, laplacianVariance: 130.4, isBlurry: false }
    });

    await Document.create({
      applicationId: app2._id,
      documentType: 'income_certificate',
      originalFileName: 'income_rani.png',
      cloudinaryUrl: createSampleDocDataUri('Income Certificate', {
        'Applicant Name': 'Rani Kerketta',
        'Annual Income': 'Rs. 6,50,000 (Six Lakhs Fifty Thousand)',
        'Certificate No': 'INC/JH/2024/11094'
      }),
      cloudinaryPublicId: 'local_income_rani',
      imageHash: { phash: '0718a1b2c3d4e5f6', dhash: '7908f6e5d4c3b207', composite_hash: '0718a1b2c3d4e5f6_7908f6e5d4c3b207' },
      extractedFields: { applicant_name: 'Rani Kerketta', annual_income: 650000, certificate_number: 'INC/JH/2024/11094' },
      ocrConfidence: 0.91,
      qualityCheck: { qualityScore: 90, laplacianVariance: 122.0, isBlurry: false }
    });

    await Document.create({
      applicationId: app2._id,
      documentType: 'mark_sheet',
      originalFileName: 'marksheet_rani_mismatch.png',
      cloudinaryUrl: createSampleDocDataUri('Higher Secondary Mark Sheet', {
        'Student Name': 'Rani Kumari Soren', // Mismatched name
        'Percentage': '54.0%',
        'Roll No': 'JAC-2023-4901'
      }),
      cloudinaryPublicId: 'local_marks_rani',
      imageHash: { phash: '18a1b2c3d4e5f607', dhash: '8908f6e5d4c3b218', composite_hash: '18a1b2c3d4e5f607_8908f6e5d4c3b218' },
      extractedFields: { student_name: 'Rani Kumari Soren', percentage_cgpa: 54.0, roll_number: 'JAC-2023-4901' },
      ocrConfidence: 0.89,
      qualityCheck: { qualityScore: 91, laplacianVariance: 125.0, isBlurry: false }
    });

    await VerificationReport.create({
      applicationId: app2._id,
      riskScore: 85,
      riskLevel: 'HIGH',
      fieldChecks: [],
      crossDocumentChecks: {
        consistencyScore: 50,
        nameComparisons: [
          { documentType: 'caste_certificate', extractedName: 'Rani Kerketta', targetName: 'Rani Kerketta', similarityScore: 100, isMatch: true },
          { documentType: 'mark_sheet', extractedName: 'Rani Kumari Soren', targetName: 'Rani Kerketta', similarityScore: 42, isMatch: false }
        ],
        dobComparisons: [],
        categoryComparisons: [],
        bankComparisons: [],
        crossCheckFlags: [{
          type: 'NAME_MISMATCH',
          severity: 'HIGH',
          documentType: 'mark_sheet',
          message: "Name on Mark Sheet ('Rani Kumari Soren') does not match Application form ('Rani Kerketta') (Similarity: 42%)."
        }]
      },
      duplicateFlags: [],
      eligibilityResults: {
        isEligible: false,
        overallStatus: 'FLAGGED_FOR_REVIEW',
        rulesEvaluated: [
          { rule: 'Family Income Ceiling', required: 'Below ₹2,50,000', actual: '₹6,50,000', status: 'FAIL' },
          { rule: 'Category Requirement', required: 'Scheduled Tribe (ST)', actual: 'ST', status: 'PASS' },
          { rule: 'Minimum Academic Percentage', required: '>= 50.0%', actual: '54.0%', status: 'PASS' }
        ]
      },
      summaryReasons: [
        'Income Limit Exceeded: Declared family income ₹6,50,000 exceeds scheme ceiling of ₹2,50,000.',
        'Cross-Check Flag: Name on Mark Sheet (Rani Kumari Soren) differs significantly from Application form (Rani Kerketta).'
      ]
    });

    // --- APPLICATION 3: Kalyan Soren (Critical Risk: Duplicate Certificate Hash) ---
    const app3 = await Application.create({
      applicationNumber: 'ST-2026-90412',
      applicantName: 'Kalyan Soren',
      dob: '04/04/2001',
      gender: 'Male',
      category: 'ST',
      subTribe: 'Santhal',
      aadhaarNumberMasked: 'XXXX-XXXX-1234', // Duplicate Aadhaar collision with App 1!
      aadhaarHash: app1AadhaarHash,
      income: 150000,
      course: 'B.Tech in Computer Science',
      institution: 'NIT Jamshedpur',
      academicPercentage: 62.0,
      bankAccountNumber: '389201948102', // Duplicate Bank Account with App 1!
      ifscCode: 'SBIN0001234',
      schemeId: nfstScheme._id,
      status: 'under_review',
      riskScore: 95,
      riskLevel: 'HIGH',
      submittedAt: new Date(Date.now() - 1 * 86400000)
    });

    // Document with identical composite_hash as Birsa Munda's caste doc
    await Document.create({
      applicationId: app3._id,
      documentType: 'caste_certificate',
      originalFileName: 'caste_kalyan_forged.png',
      cloudinaryUrl: app1CasteDoc.cloudinaryUrl,
      cloudinaryPublicId: 'local_caste_kalyan_dup',
      imageHash: { phash: 'a1b2c3d4e5f60718', dhash: '1807f6e5d4c3b2a1', composite_hash: 'a1b2c3d4e5f60718_1807f6e5d4c3b2a1' },
      extractedFields: { applicant_name: 'Birsa Munda', category: 'Scheduled Tribe', tribe_name: 'Munda', certificate_number: 'ST/JH/2024/00819' },
      ocrConfidence: 0.94,
      qualityCheck: { qualityScore: 96, laplacianVariance: 154.2, isBlurry: false }
    });

    await VerificationReport.create({
      applicationId: app3._id,
      riskScore: 95,
      riskLevel: 'HIGH',
      fieldChecks: [],
      crossDocumentChecks: {
        consistencyScore: 30,
        nameComparisons: [{ documentType: 'caste_certificate', extractedName: 'Birsa Munda', targetName: 'Kalyan Soren', similarityScore: 28, isMatch: false }],
        dobComparisons: [],
        categoryComparisons: [],
        bankComparisons: [],
        crossCheckFlags: [{ type: 'NAME_MISMATCH', severity: 'HIGH', message: 'Name on Caste Certificate belongs to Birsa Munda, not Kalyan Soren.' }]
      },
      duplicateFlags: [
        {
          type: 'DUPLICATE_IMAGE_HASH',
          severity: 'CRITICAL',
          documentType: 'caste_certificate',
          conflictingApplicationId: app1._id,
          conflictingApplicationNumber: app1.applicationNumber,
          conflictingApplicantName: app1.applicantName,
          message: `Duplicate Document Detected: CASTE CERTIFICATE exact image hash was previously submitted in Application #${app1.applicationNumber} (${app1.applicantName}).`
        },
        {
          type: 'DUPLICATE_AADHAAR',
          severity: 'CRITICAL',
          conflictingApplicationId: app1._id,
          conflictingApplicationNumber: app1.applicationNumber,
          conflictingApplicantName: app1.applicantName,
          message: `Duplicate Aadhaar Identity: Aadhaar (${app3.aadhaarNumberMasked}) is already registered under Application #${app1.applicationNumber} (${app1.applicantName}).`
        },
        {
          type: 'DUPLICATE_BANK_ACCOUNT',
          severity: 'HIGH',
          conflictingApplicationId: app1._id,
          conflictingApplicationNumber: app1.applicationNumber,
          conflictingApplicantName: app1.applicantName,
          message: `Shared Bank Account Suspicion: Account #${app3.bankAccountNumber} is also attached to different applicant '${app1.applicantName}' (App #${app1.applicationNumber}).`
        }
      ],
      eligibilityResults: {
        isEligible: false,
        overallStatus: 'FLAGGED_FOR_REVIEW',
        rulesEvaluated: [
          { rule: 'Family Income Ceiling', required: 'Below ₹6,00,000', actual: '₹1,50,000', status: 'PASS' },
          { rule: 'Category Requirement', required: 'Scheduled Tribe (ST)', actual: 'ST', status: 'PASS' },
          { rule: 'Minimum Academic Percentage', required: '>= 60.0%', actual: '62.0%', status: 'PASS' }
        ]
      },
      summaryReasons: [
        `Duplicate Document Detected: Caste Certificate exact perceptual image hash previously submitted in App #${app1.applicationNumber} (${app1.applicantName}).`,
        `Duplicate Aadhaar Identity: Masked Aadhaar (${app3.aadhaarNumberMasked}) previously submitted under App #${app1.applicationNumber}.`,
        `Shared Bank Account Suspicion: Bank Account #${app3.bankAccountNumber} is attached to another applicant name (${app1.applicantName}).`
      ]
    });

    // 4. Seed Initial Audit Logs
    await AuditLog.create([
      {
        userId: officerUser._id,
        userName: officerUser.name,
        role: 'officer',
        action: 'USER_LOGIN',
        targetApplicationId: null,
        details: { email: officerUser.email, loginMethod: 'Password' }
      },
      {
        userId: adminUser._id,
        userName: adminUser.name,
        role: 'admin',
        action: 'SCHEME_CREATED',
        targetApplicationId: null,
        details: { schemeCode: 'NFST-2026', schemeName: nfstScheme.name }
      },
      {
        userId: officerUser._id,
        userName: officerUser.name,
        role: 'officer',
        action: 'VERIFICATION_TRIGGERED',
        targetApplicationId: app1._id,
        details: { riskScore: 10, riskLevel: 'LOW' }
      }
    ]);

    console.log('✔ Initial Audit Logs seeded');
    console.log('--- SatyaPatra AI Seed Complete ---');
  } catch (err) {
    console.error('Seed Error:', err);
  }
};

module.exports = seedDatabase;
