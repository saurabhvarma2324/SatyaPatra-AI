const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// In-Memory Database State
const store = {
  users: [],
  schemes: [],
  applications: [],
  documents: [],
  verificationReports: [],
  auditLogs: []
};

// SVG Document Generator for realistic data preview URLs
const createSampleDocDataUri = (title, fields) => {
  const fieldLines = Object.entries(fields)
    .map(([k, v], idx) => `<text x="50" y="${120 + idx * 35}" font-family="Arial, sans-serif" font-size="16" fill="#1e293b"><tspan font-weight="bold">${k.toUpperCase()}:</tspan> ${v}</text>`)
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

// Initialize In-Memory Seed Data
const initMemoryStore = async () => {
  if (store.users.length > 0) return;

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Password@123', salt);

  // 1. Users
  const officer = {
    _id: 'usr_officer_01',
    name: 'Dr. Rameshwar Oraon',
    email: 'officer@satyapatra.gov.in',
    passwordHash: defaultPasswordHash,
    role: 'officer',
    designation: 'Senior Verification Officer (ST Welfare)',
    department: 'Ministry of Tribal Affairs, Govt. of India',
    createdAt: new Date(),
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.passwordHash);
    }
  };

  const admin = {
    _id: 'usr_admin_01',
    name: 'Chief Admin Sentinel',
    email: 'admin@satyapatra.gov.in',
    passwordHash: defaultPasswordHash,
    role: 'admin',
    designation: 'System Administrator & Scheme Director',
    department: 'National Tribal Informatics Center',
    createdAt: new Date(),
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.passwordHash);
    }
  };

  const applicant = {
    _id: 'usr_applicant_01',
    name: 'Birsa Munda',
    email: 'applicant@satyapatra.gov.in',
    passwordHash: defaultPasswordHash,
    role: 'applicant',
    designation: 'Student / Fellowship Applicant',
    department: 'Tribal Higher Education',
    createdAt: new Date(),
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.passwordHash);
    }
  };

  store.users = [officer, admin, applicant];

  // 2. Schemes
  const nfstScheme = {
    _id: 'sch_nfst_01',
    name: 'National Fellowship and Scholarship for Higher Education of ST Students (NFST)',
    code: 'NFST-2026',
    description: 'Central sector scheme providing full financial support to ST students pursuing M.Phil/Ph.D. and graduate professional degrees.',
    category: 'ST',
    incomeLimit: 600000,
    minPercentage: 60.0,
    approvedCourses: ['B.Tech in Computer Science', 'M.Tech', 'Ph.D. in Tribal Studies', 'MBBS', 'MBA'],
    approvedInstitutions: ['IIT Bombay', 'NIT Jamshedpur', 'Ranchi University', 'AIIMS New Delhi', 'IIM Ahmedabad'],
    isActive: true,
    createdAt: new Date()
  };

  const pmsScheme = {
    _id: 'sch_pms_01',
    name: 'Post-Matric Scholarship for Scheduled Tribe Students (PMS-ST)',
    code: 'PMS-ST-2026',
    description: 'Centrally sponsored scholarship scheme assisting ST students studying at post-matriculation stages.',
    category: 'ST',
    incomeLimit: 250000,
    minPercentage: 50.0,
    approvedCourses: ['B.A. Political Science', 'B.Sc Physics', 'B.Com', 'Diploma in Engineering'],
    approvedInstitutions: ['St. Xaviers College Ranchi', 'Marwari College', 'Govt Polytechnic Ranchi'],
    isActive: true,
    createdAt: new Date()
  };

  const tcesScheme = {
    _id: 'sch_tces_01',
    name: 'Top Class Education Scheme for ST Students',
    code: 'TCES-ST-2026',
    description: 'Assisting meritorious ST students securing admission in notified institutions of excellence across India.',
    category: 'ST',
    incomeLimit: 600000,
    minPercentage: 65.0,
    approvedCourses: ['B.Tech', 'MBBS', 'B.Arch', 'LL.B.'],
    approvedInstitutions: ['IIT Delhi', 'IIT Kharagpur', 'NIT Rourkela', 'NLU Bangalore'],
    isActive: true,
    createdAt: new Date()
  };

  store.schemes = [nfstScheme, pmsScheme, tcesScheme];

  // 3. Applications
  const app1 = {
    _id: 'app_st_001',
    applicationNumber: 'ST-2026-10492',
    applicantName: 'Birsa Munda',
    dob: '15/08/2002',
    gender: 'Male',
    category: 'ST',
    subTribe: 'Munda',
    aadhaarNumberMasked: 'XXXX-XXXX-1234',
    aadhaarHash: crypto.createHash('sha256').update('543298761234').digest('hex'),
    income: 120000,
    course: 'B.Tech in Computer Science',
    institution: 'National Institute of Technology (NIT) Jamshedpur',
    academicPercentage: 78.5,
    bankAccountNumber: '389201948102',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    schemeId: nfstScheme._id,
    scheme: nfstScheme,
    status: 'under_review',
    riskScore: 10,
    riskLevel: 'LOW',
    submittedAt: new Date(Date.now() - 3 * 86400000),
    officerDecision: null
  };

  const app2 = {
    _id: 'app_st_002',
    applicationNumber: 'ST-2026-20981',
    applicantName: 'Anil Kumar Soren',
    dob: '22/11/2001',
    gender: 'Male',
    category: 'ST',
    subTribe: 'Santhal',
    aadhaarNumberMasked: 'XXXX-XXXX-8921',
    aadhaarHash: crypto.createHash('sha256').update('982143658921').digest('hex'),
    income: 280000,
    course: 'M.Tech in Structural Engineering',
    institution: 'IIT Kharagpur',
    academicPercentage: 72.0,
    bankAccountNumber: '501002938471',
    ifscCode: 'HDFC0000456',
    bankName: 'HDFC Bank',
    schemeId: nfstScheme._id,
    scheme: nfstScheme,
    status: 'under_review',
    riskScore: 78,
    riskLevel: 'HIGH',
    submittedAt: new Date(Date.now() - 2 * 86400000),
    officerDecision: null
  };

  const app3 = {
    _id: 'app_st_003',
    applicationNumber: 'ST-2026-30114',
    applicantName: 'Jaipal Singh Munda',
    dob: '03/01/2003',
    gender: 'Male',
    category: 'ST',
    subTribe: 'Munda',
    aadhaarNumberMasked: 'XXXX-XXXX-9901',
    aadhaarHash: crypto.createHash('sha256').update('887766559901').digest('hex'),
    income: 180000,
    course: 'B.A. Political Science',
    institution: 'St. Xaviers College Ranchi',
    academicPercentage: 64.0,
    bankAccountNumber: '918237461082',
    ifscCode: 'SBIN0009876',
    bankName: 'State Bank of India',
    schemeId: pmsScheme._id,
    scheme: pmsScheme,
    status: 'under_review',
    riskScore: 35,
    riskLevel: 'MEDIUM',
    submittedAt: new Date(Date.now() - 1 * 86400000),
    officerDecision: null
  };

  store.applications = [app1, app2, app3];

  // 4. Documents for App 1
  store.documents = [
    {
      _id: 'doc_app1_caste',
      applicationId: app1._id,
      documentType: 'caste_certificate',
      originalFileName: 'caste_certificate_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Scheduled Tribe Certificate', {
        'Applicant Name': 'Birsa Munda',
        'Category': 'Scheduled Tribe (ST)',
        'Tribe': 'Munda',
        'Certificate No': 'ST/JH/2024/00819',
        'Date of Issue': '14/06/2023'
      }),
      extractedFields: { applicant_name: 'Birsa Munda', category: 'Scheduled Tribe', tribe_name: 'Munda', certificate_number: 'ST/JH/2024/00819' },
      ocrConfidence: 0.94,
      qualityCheck: { qualityScore: 96, laplacianVariance: 154.2, isBlurry: false }
    },
    {
      _id: 'doc_app1_income',
      applicationId: app1._id,
      documentType: 'income_certificate',
      originalFileName: 'income_certificate_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Annual Income Certificate', {
        'Applicant Name': 'Birsa Munda',
        'Annual Income': 'Rs. 1,20,000',
        'Certificate No': 'INC/JH/2024/09321'
      }),
      extractedFields: { applicant_name: 'Birsa Munda', annual_income: 120000, certificate_number: 'INC/JH/2024/09321' },
      ocrConfidence: 0.93,
      qualityCheck: { qualityScore: 94, laplacianVariance: 142.1, isBlurry: false }
    },
    {
      _id: 'doc_app1_aadhaar',
      applicationId: app1._id,
      documentType: 'aadhaar_card',
      originalFileName: 'aadhaar_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Unique Identification Authority of India', {
        'Name': 'Birsa Munda',
        'DOB': '15/08/2002',
        'Aadhaar No': 'XXXX-XXXX-1234'
      }),
      extractedFields: { applicant_name: 'Birsa Munda', dob: '15/08/2002', aadhaar_number: '543298761234', aadhaar_masked: 'XXXX-XXXX-1234' },
      ocrConfidence: 0.97,
      qualityCheck: { qualityScore: 98, laplacianVariance: 180.5, isBlurry: false }
    },
    {
      _id: 'doc_app1_marks',
      applicationId: app1._id,
      documentType: 'mark_sheet',
      originalFileName: 'marksheet_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('Academic Mark Sheet', {
        'Student Name': 'Birsa Munda',
        'Percentage': '78.5%',
        'Institution': 'NIT Jamshedpur'
      }),
      extractedFields: { student_name: 'Birsa Munda', percentage_cgpa: 78.5, board_university: 'NIT Jamshedpur' },
      ocrConfidence: 0.92,
      qualityCheck: { qualityScore: 95, laplacianVariance: 148.0, isBlurry: false }
    },
    {
      _id: 'doc_app1_bank',
      applicationId: app1._id,
      documentType: 'bank_passbook',
      originalFileName: 'bank_passbook_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('State Bank of India Passbook', {
        'Account Holder': 'Birsa Munda',
        'Account Number': '389201948102',
        'IFSC Code': 'SBIN0001234'
      }),
      extractedFields: { account_holder_name: 'Birsa Munda', account_number: '389201948102', ifsc_code: 'SBIN0001234' },
      ocrConfidence: 0.95,
      qualityCheck: { qualityScore: 97, laplacianVariance: 165.2, isBlurry: false }
    },
    {
      _id: 'doc_app1_admission',
      applicationId: app1._id,
      documentType: 'admission_proof',
      originalFileName: 'bonafide_birsa.png',
      cloudinaryUrl: createSampleDocDataUri('NIT Jamshedpur Bonafide Certificate', {
        'Candidate Name': 'Birsa Munda',
        'Course': 'B.Tech Computer Science',
        'Admission No': 'NITJ/2023/ST/042'
      }),
      extractedFields: { candidate_name: 'Birsa Munda', course_enrolled: 'B.Tech in Computer Science', institution_name: 'NIT Jamshedpur' },
      ocrConfidence: 0.91,
      qualityCheck: { qualityScore: 93, laplacianVariance: 139.8, isBlurry: false }
    }
  ];

  // 5. Verification Reports
  store.verificationReports = [
    {
      _id: 'rep_app1',
      applicationId: app1._id,
      overallRiskScore: 10,
      riskLevel: 'LOW',
      crossCheckMatrix: [
        { checkName: 'Name Consistency', field: 'applicant_name', extractedValue: 'Birsa Munda', expectedValue: 'Birsa Munda', matchScore: 100, isMatch: true },
        { checkName: 'Date of Birth Verification', field: 'dob', extractedValue: '15/08/2002', expectedValue: '15/08/2002', matchScore: 100, isMatch: true },
        { checkName: 'ST Category Validity', field: 'category', extractedValue: 'Scheduled Tribe (ST)', expectedValue: 'ST', matchScore: 100, isMatch: true },
        { checkName: 'Bank Account Match', field: 'bank_account', extractedValue: '389201948102', expectedValue: '389201948102', matchScore: 100, isMatch: true },
        { checkName: 'Scheme Income Eligibility', field: 'income', extractedValue: '₹1,20,000', expectedValue: '<= ₹6,00,000', matchScore: 100, isMatch: true }
      ],
      fraudFlags: [],
      schemeEligibility: { isEligible: true, incomeLimitPassed: true, academicPercentagePassed: true, reasons: ['All criteria satisfied'] },
      aiSummary: 'All 6 documents match with 100% identity and category consistency. Sharp image quality, zero duplication flags detected.',
      verifiedAt: new Date()
    },
    {
      _id: 'rep_app2',
      applicationId: app2._id,
      overallRiskScore: 78,
      riskLevel: 'HIGH',
      crossCheckMatrix: [
        { checkName: 'Name Consistency', field: 'applicant_name', extractedValue: 'Rajesh Soren vs Anil Soren', expectedValue: 'Anil Kumar Soren', matchScore: 42, isMatch: false, reason: 'Name mismatch on Caste Certificate' },
        { checkName: 'Date of Birth Verification', field: 'dob', extractedValue: '22/11/2001', expectedValue: '22/11/2001', matchScore: 100, isMatch: true },
        { checkName: 'Image Quality Assessment', field: 'quality', extractedValue: 'Laplacian: 41.2', expectedValue: '>= 75.0', matchScore: 40, isMatch: false, reason: 'Income Certificate scan is heavily blurred' }
      ],
      fraudFlags: [
        { code: 'NAME_MISMATCH_CASTE', severity: 'HIGH', message: 'Caste Certificate name (Rajesh Soren) does not match applicant (Anil Kumar Soren).' },
        { code: 'BLURRY_DOCUMENT', severity: 'MEDIUM', message: 'Income certificate is blurred (< 75 sharpness variance).' }
      ],
      schemeEligibility: { isEligible: false, incomeLimitPassed: true, academicPercentagePassed: true, reasons: ['Document authenticity discrepancy on Caste Certificate'] },
      aiSummary: 'Critical name discrepancy detected on Caste Certificate (Levenshtein match 42%). Image quality low on Income Certificate.',
      verifiedAt: new Date()
    }
  ];

  // 6. Audit Logs
  store.auditLogs = [
    {
      _id: 'log_001',
      userId: officer._id,
      userName: officer.name,
      role: officer.role,
      action: 'SYSTEM_STARTUP',
      targetApplicationId: null,
      details: { message: 'SatyaPatra AI Verification Platform initialized' },
      ipAddress: '127.0.0.1',
      timestamp: new Date(Date.now() - 3600000)
    }
  ];
};

initMemoryStore();

module.exports = {
  store,
  initMemoryStore,
  createSampleDocDataUri
};
