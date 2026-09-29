const assert = require('assert');
const AIServiceClient = require('../src/services/aiServiceClient');

// Mock Application and Document payloads
const mockApp = {
  applicantName: 'Birsa Munda',
  dob: '15/08/2002',
  category: 'ST',
  income: 120000,
  bankAccountNumber: '389201948102'
};

const mockDocs = [
  {
    documentType: 'caste_certificate',
    extractedFields: { applicant_name: 'Birsa Munda', category: 'Scheduled Tribe', tribe_name: 'Munda' }
  },
  {
    documentType: 'income_certificate',
    extractedFields: { applicant_name: 'Birsa Munda', annual_income: 120000 }
  },
  {
    documentType: 'aadhaar_card',
    extractedFields: { applicant_name: 'Birsa Munda', dob: '15/08/2002', aadhaar_masked: 'XXXX-XXXX-1234' }
  }
];

async function runTests() {
  console.log('Running SatyaPatra Backend Pipeline Tests...');

  // Test 1: Cross Check Consistency
  const crossCheck = AIServiceClient._fallbackCrossCheck(mockApp, mockDocs);
  assert.strictEqual(crossCheck.consistency_score, 100, 'Clean documents should yield 100% consistency score');
  console.log('✔ Test 1 Passed: Clean document cross-check consistency is 100%');

  // Test 2: Mismatched Name Detection
  const mismatchedDocs = [
    {
      documentType: 'mark_sheet',
      extractedFields: { student_name: 'Rani Kumari Soren' }
    }
  ];
  const mismatchResult = AIServiceClient._fallbackCrossCheck(mockApp, mismatchedDocs);
  assert.strictEqual(mismatchResult.cross_check_flags.length > 0, true, 'Name mismatch should trigger cross check flag');
  console.log('✔ Test 2 Passed: Mismatched candidate name properly flagged');

  // Test 3: Document Extraction Formats
  const extCaste = AIServiceClient._fallbackPipeline('mock_url', 'caste_certificate');
  assert.strictEqual(extCaste.extracted_fields.category, 'Scheduled Tribe');
  assert.strictEqual(extCaste.quality_check.is_blurry, false);
  console.log('✔ Test 3 Passed: Document extraction schema & blur check intact');

  console.log('--- ALL BACKEND UNIT TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
