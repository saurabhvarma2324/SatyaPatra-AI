/**
 * ArthaDrishti AI - Synthetic Financial Crime Investigation Dataset
 * For Evaluation & Demonstration Purposes Only. All data is synthetically generated.
 */

// Helper to generate consistent dates
const now = new Date('2026-08-19T21:00:00Z');
const minutesAgo = (mins) => new Date(now.getTime() - mins * 60 * 1000).toISOString();
const hoursAgo = (hours) => new Date(now.getTime() - hours * 3600 * 1000).toISOString();
const daysAgo = (days) => new Date(now.getTime() - days * 86400 * 1000).toISOString();

// Accounts (100 accounts generated)
export const initialAccounts = [
  { id: 'ACC-10082', accountNumber: '918237461082', name: 'Apex Global Logistics Pvt Ltd', type: 'Current Account', bank: 'State Bank of India', balance: 4852000, riskScore: 91, status: 'Active', createdAt: '2023-03-12', firstSeen: '2023-03-12', lastActivity: minutesAgo(2) },
  { id: 'ACC-10211', accountNumber: '918237461021', name: 'Vanguard Trading Hub', type: 'Current Account', bank: 'HDFC Bank', balance: 1420000, riskScore: 84, status: 'Active', createdAt: '2024-01-15', firstSeen: '2024-01-15', lastActivity: minutesAgo(12) },
  { id: 'ACC-10542', accountNumber: '918237461054', name: 'Zenith Multi-Ventures', type: 'Current Account', bank: 'ICICI Bank', balance: 890000, riskScore: 87, status: 'Active', createdAt: '2024-06-02', firstSeen: '2024-06-02', lastActivity: minutesAgo(25) },
  { id: 'ACC-10881', accountNumber: '918237461088', name: 'Kavya Digital Solutions', type: 'Current Account', bank: 'Axis Bank', balance: 320000, riskScore: 89, status: 'Active', createdAt: '2025-11-20', firstSeen: '2025-11-20', lastActivity: minutesAgo(40) },
  { id: 'ACC-10900', accountNumber: '918237461090', name: 'BlueStar Export Impex', type: 'Current Account', bank: 'Kotak Mahindra Bank', balance: 650000, riskScore: 78, status: 'Active', createdAt: '2025-12-05', firstSeen: '2025-12-05', lastActivity: hoursAgo(2) },
  { id: 'ACC-10145', accountNumber: '918237461014', name: 'Rapid Flow Financials', type: 'Current Account', bank: 'Punjab National Bank', balance: 2900000, riskScore: 88, status: 'Active', createdAt: '2023-08-14', firstSeen: '2023-08-14', lastActivity: hoursAgo(1) },
  { id: 'ACC-10332', accountNumber: '918237461033', name: 'Devendra Kumar (Proprietor)', type: 'Savings Account', bank: 'Bank of Baroda', balance: 1150000, riskScore: 76, status: 'Active', createdAt: '2022-05-19', firstSeen: '2022-05-19', lastActivity: hoursAgo(3) },
  { id: 'ACC-10780', accountNumber: '918237461078', name: 'Oceanic Horizon Freight', type: 'Current Account', bank: 'IndusInd Bank', balance: 7450000, riskScore: 62, status: 'Active', createdAt: '2021-10-10', firstSeen: '2021-10-10', lastActivity: hoursAgo(5) },
  { id: 'ACC-10001', accountNumber: '918237460001', name: 'Pooja Verma', type: 'Savings Account', bank: 'HDFC Bank', balance: 45000, riskScore: 12, status: 'Active', createdAt: '2022-01-10', firstSeen: '2022-01-10', lastActivity: daysAgo(1) },
  { id: 'ACC-10002', accountNumber: '918237460002', name: 'Rahul Sharma', type: 'Savings Account', bank: 'State Bank of India', balance: 92000, riskScore: 18, status: 'Active', createdAt: '2021-04-15', firstSeen: '2021-04-15', lastActivity: hoursAgo(6) },
  { id: 'ACC-10003', accountNumber: '918237460003', name: 'Ananya Deshmukh', type: 'Savings Account', bank: 'ICICI Bank', balance: 135000, riskScore: 22, status: 'Active', createdAt: '2023-02-28', firstSeen: '2023-02-28', lastActivity: hoursAgo(4) },
  { id: 'ACC-10004', accountNumber: '918237460004', name: 'TechCraft Innovations LLP', type: 'Current Account', bank: 'Axis Bank', balance: 3400000, riskScore: 28, status: 'Active', createdAt: '2022-09-01', firstSeen: '2022-09-01', lastActivity: hoursAgo(10) },
  { id: 'ACC-10005', accountNumber: '918237460005', name: 'Siddharth Nair', type: 'Savings Account', bank: 'Kotak Mahindra Bank', balance: 78000, riskScore: 15, status: 'Active', createdAt: '2023-11-11', firstSeen: '2023-11-11', lastActivity: daysAgo(2) },
];

// Generate additional standard accounts up to 100
for (let i = 14; i <= 100; i++) {
  const pad = String(i).padStart(4, '0');
  const baseScore = (i % 7 === 0) ? Math.floor(65 + (i % 25)) : Math.floor(10 + (i % 35));
  initialAccounts.push({
    id: `ACC-${10000 + i}`,
    accountNumber: `91823746${pad}`,
    name: `Enterprise Partner #${i}`,
    type: (i % 3 === 0) ? 'Current Account' : 'Savings Account',
    bank: ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Kotak Mahindra Bank'][i % 6],
    balance: Math.floor(50000 + (i * 45000)),
    riskScore: baseScore,
    status: 'Active',
    createdAt: daysAgo(300 + (i * 5)),
    firstSeen: daysAgo(300 + (i * 5)),
    lastActivity: hoursAgo((i % 48) + 1),
  });
}

// Risk Indicators for Flagship Case CASE-1042
export const case1042Indicators = [
  {
    id: 'IND-101',
    caseId: 'CASE-1042',
    type: 'Transaction Velocity',
    severity: 'HIGH',
    value: '42 tx / 24h (320% vs baseline)',
    description: 'Transaction frequency is significantly higher than the account\'s historical baseline of 3 tx/day.',
  },
  {
    id: 'IND-102',
    caseId: 'CASE-1042',
    type: 'Network Connectivity',
    severity: 'HIGH',
    value: '14 connected nodes (4 high-risk hops)',
    description: 'Dense interconnected cluster detected with rapid onward fund dispersion across multiple tier-2 accounts.',
  },
  {
    id: 'IND-103',
    caseId: 'CASE-1042',
    type: 'Behavioural Deviation',
    severity: 'HIGH',
    value: 'Deviation Z-Score: +3.84',
    description: 'Sudden change in operational timing (multiple high-value transactions during off-market hours 01:00-04:00 AM).',
  },
  {
    id: 'IND-104',
    caseId: 'CASE-1042',
    type: 'Amount Anomaly',
    severity: 'MEDIUM',
    value: '₹85,000 - ₹98,500 just below ₹1,00,000 reporting threshold',
    description: 'Repetitive structured amounts clustering just beneath typical automated monitoring thresholds.',
  },
  {
    id: 'IND-105',
    caseId: 'CASE-1042',
    type: 'New Account Relationship',
    severity: 'HIGH',
    value: '5 new counterparties in < 48 hours',
    description: 'Immediate high-volume fund routing to entities registered under 30 days ago.',
  },
];

// Suspicious Cases (20 Cases)
export const initialCases = [
  {
    id: 'CASE-1042',
    caseNumber: 'CASE-1042',
    primaryAccount: 'ACC-10082',
    accountName: 'Apex Global Logistics Pvt Ltd',
    riskScore: 91,
    riskLevel: 'HIGH',
    status: 'Under Investigation',
    assignedInvestigator: 'Demo Investigator',
    createdAt: hoursAgo(4),
    updatedAt: minutesAgo(2),
    transactionCount: 42,
    totalVolume: 4250000,
    description: 'High-frequency structured outbound transfers with rapid multi-hop dispersion and potential circular flow.',
    indicatorsCount: 5,
    indicators: case1042Indicators,
    notes: 'Initial graph analysis confirms rapid fan-out layering into ACC-10211 and ACC-10542. Account holder contacted for documentation verification.',
  },
  {
    id: 'CASE-1043',
    caseNumber: 'CASE-1043',
    primaryAccount: 'ACC-10145',
    accountName: 'Rapid Flow Financials',
    riskScore: 88,
    riskLevel: 'HIGH',
    status: 'New',
    assignedInvestigator: 'Demo Investigator',
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(1),
    transactionCount: 28,
    totalVolume: 3100000,
    description: 'Structuring pattern detected with 12 split payments received within 45 minutes.',
    indicatorsCount: 4,
    indicators: [
      { id: 'IND-201', caseId: 'CASE-1043', type: 'Amount Anomaly', severity: 'HIGH', value: '12 tx of ₹49,500', description: 'Repeated structured micro-amounts beneath threshold.' },
      { id: 'IND-202', caseId: 'CASE-1043', type: 'Transaction Velocity', severity: 'HIGH', value: '12 tx / 45m', description: 'Abnormal burst frequency.' }
    ],
    notes: 'Awaiting preliminary source-of-funds verification.',
  },
  {
    id: 'CASE-1044',
    caseNumber: 'CASE-1044',
    primaryAccount: 'ACC-10332',
    accountName: 'Devendra Kumar (Proprietor)',
    riskScore: 76,
    riskLevel: 'HIGH',
    status: 'Escalated',
    assignedInvestigator: 'Senior Analyst R. Mehta',
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(3),
    transactionCount: 19,
    totalVolume: 1850000,
    description: 'Dormant account reactivation with immediate high-value international inward transfers.',
    indicatorsCount: 3,
    indicators: [
      { id: 'IND-301', caseId: 'CASE-1044', type: 'Behavioural Deviation', severity: 'HIGH', value: '180 days dormancy broken', description: 'Zero activity followed by instant high-volume spikes.' },
    ],
    notes: 'Escalated to Compliance Unit for AML KYC audit.',
  },
  {
    id: 'CASE-1045',
    caseNumber: 'CASE-1045',
    primaryAccount: 'ACC-10780',
    accountName: 'Oceanic Horizon Freight',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    status: 'Under Investigation',
    assignedInvestigator: 'Demo Investigator',
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(5),
    transactionCount: 15,
    totalVolume: 7450000,
    description: 'Incongruent remittance volume vs declared business turnover.',
    indicatorsCount: 2,
    indicators: [
      { id: 'IND-401', caseId: 'CASE-1045', type: 'Amount Anomaly', severity: 'MEDIUM', value: '450% above monthly average', description: 'Volume exceeds historical trade profile.' }
    ],
    notes: 'Requested customs bills of lading.',
  },
  {
    id: 'CASE-1046',
    caseNumber: 'CASE-1046',
    primaryAccount: 'ACC-10021',
    accountName: 'Enterprise Partner #21',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    status: 'New',
    assignedInvestigator: 'Demo Investigator',
    createdAt: hoursAgo(2),
    updatedAt: minutesAgo(10),
    transactionCount: 55,
    totalVolume: 9200000,
    description: 'Automated rapid cycle detected across 6 nested accounts in under 90 minutes.',
    indicatorsCount: 5,
    indicators: [
      { id: 'IND-501', caseId: 'CASE-1046', type: 'Network Connectivity', severity: 'CRITICAL', value: 'Direct cyclic fund loop', description: 'Fund round-tripping detected.' }
    ],
    notes: 'Immediate review flag raised.',
  },
  {
    id: 'CASE-1047',
    caseNumber: 'CASE-1047',
    primaryAccount: 'ACC-10028',
    accountName: 'Enterprise Partner #28',
    riskScore: 82,
    riskLevel: 'HIGH',
    status: 'Under Investigation',
    assignedInvestigator: 'Demo Investigator',
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(6),
    transactionCount: 31,
    totalVolume: 2700000,
    description: 'Pass-through account behavior: 98% of incoming funds swept out in under 10 minutes.',
    indicatorsCount: 4,
    indicators: [
      { id: 'IND-601', caseId: 'CASE-1047', type: 'Transaction Velocity', severity: 'HIGH', value: 'Sweep delay: 6 mins', description: 'Immediate pass-through liquidity.' }
    ],
    notes: 'Beneficiary destination addresses under scrutiny.',
  },
  {
    id: 'CASE-1048',
    caseNumber: 'CASE-1048',
    primaryAccount: 'ACC-10035',
    accountName: 'Enterprise Partner #35',
    riskScore: 48,
    riskLevel: 'MEDIUM',
    status: 'Resolved',
    assignedInvestigator: 'Analyst K. Sharma',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    transactionCount: 14,
    totalVolume: 980000,
    description: 'Spike in weekend POS settlements verified as festive sale volume.',
    indicatorsCount: 1,
    indicators: [
      { id: 'IND-701', caseId: 'CASE-1048', type: 'Amount Anomaly', severity: 'LOW', value: 'Festive retail spike', description: 'Validated by merchant terminal receipts.' }
    ],
    notes: 'Legitimate business surge confirmed by merchant statement. Case closed.',
  },
  {
    id: 'CASE-1049',
    caseNumber: 'CASE-1049',
    primaryAccount: 'ACC-10042',
    accountName: 'Enterprise Partner #42',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    status: 'Escalated',
    assignedInvestigator: 'Senior Analyst R. Mehta',
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(12),
    transactionCount: 64,
    totalVolume: 12500000,
    description: 'High velocity layered transfers across 8 newly created accounts.',
    indicatorsCount: 5,
    indicators: [
      { id: 'IND-801', caseId: 'CASE-1049', type: 'New Account Relationship', severity: 'CRITICAL', value: '8 new counter-parties', description: 'Coordinated synthetic account cluster.' }
    ],
    notes: 'Escalated to internal fraud operations.',
  },
  {
    id: 'CASE-1050',
    caseNumber: 'CASE-1050',
    primaryAccount: 'ACC-10049',
    accountName: 'Enterprise Partner #49',
    riskScore: 35,
    riskLevel: 'LOW',
    status: 'Closed',
    assignedInvestigator: 'Analyst K. Sharma',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
    transactionCount: 8,
    totalVolume: 420000,
    description: 'Routine supplier advance payment flagged due to temporary IP geo-mismatch.',
    indicatorsCount: 1,
    indicators: [
      { id: 'IND-901', caseId: 'CASE-1050', type: 'Behavioural Deviation', severity: 'LOW', value: 'VPN IP routing', description: 'Verified remote office connection.' }
    ],
    notes: 'Verified remote office connection with IT security. Cleared.',
  },
  {
    id: 'CASE-1051',
    caseNumber: 'CASE-1051',
    primaryAccount: 'ACC-10056',
    accountName: 'Enterprise Partner #56',
    riskScore: 79,
    riskLevel: 'HIGH',
    status: 'Under Investigation',
    assignedInvestigator: 'Demo Investigator',
    createdAt: hoursAgo(18),
    updatedAt: hoursAgo(2),
    transactionCount: 22,
    totalVolume: 3400000,
    description: 'Rapid inbound aggregation from multiple small UPI handles followed by RTGS payout.',
    indicatorsCount: 3,
    indicators: [
      { id: 'IND-1001', caseId: 'CASE-1051', type: 'Network Connectivity', severity: 'HIGH', value: 'Funnel aggregation (18 in -> 1 out)', description: 'Funnel / aggregator account profile.' }
    ],
    notes: 'Analyzing sender UPI identity registrations.',
  }
];

// Generate cases 1052 to 1061 to make 20 complete cases
for (let i = 11; i <= 20; i++) {
  const caseId = `CASE-${1040 + i}`;
  const accId = `ACC-${10060 + (i * 2)}`;
  const score = (i % 3 === 0) ? 85 : (i % 2 === 0 ? 55 : 30);
  const lvl = score >= 90 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
  const st = (i % 4 === 0) ? 'Resolved' : (i % 3 === 0 ? 'Escalated' : 'Under Investigation');
  initialCases.push({
    id: caseId,
    caseNumber: caseId,
    primaryAccount: accId,
    accountName: `Synthetic Corp #${i + 20}`,
    riskScore: score,
    riskLevel: lvl,
    status: st,
    assignedInvestigator: (i % 2 === 0) ? 'Demo Investigator' : 'Analyst K. Sharma',
    createdAt: daysAgo(i - 8),
    updatedAt: hoursAgo(i * 2),
    transactionCount: 10 + (i * 3),
    totalVolume: (i * 350000),
    description: `Automated risk triage profile for transaction cluster ${caseId}.`,
    indicatorsCount: Math.min(4, Math.floor(score / 20)),
    indicators: [
      { id: `IND-${i}01`, caseId: caseId, type: 'Transaction Velocity', severity: lvl, value: `${score}% risk index`, description: 'Statistical deviation detected in velocity.' }
    ],
    notes: 'Case under standard automated telemetry monitoring.',
  });
}

// Generate 1,000+ realistic synthetic transactions
export const initialTransactions = [];

// Seed CASE-1042 Key Suspicious Transactions (Flagship)
const flagshipTx = [
  { id: 'TXN-90101', senderAccount: 'ACC-10082', receiverAccount: 'ACC-10211', amount: 98500, timestamp: minutesAgo(8), transactionType: 'NEFT', location: 'Mumbai, MH', deviceId: 'DEV-8821A', riskScore: 89, status: 'Flagged', riskContribution: 22, description: 'High velocity layered outbound' },
  { id: 'TXN-90102', senderAccount: 'ACC-10211', receiverAccount: 'ACC-10542', amount: 95000, timestamp: minutesAgo(18), transactionType: 'RTGS', location: 'New Delhi, DL', deviceId: 'DEV-9122B', riskScore: 86, status: 'Flagged', riskContribution: 19, description: 'Immediate onward transfer' },
  { id: 'TXN-90103', senderAccount: 'ACC-10542', receiverAccount: 'ACC-10881', amount: 92000, timestamp: minutesAgo(32), transactionType: 'IMPS', location: 'Bengaluru, KA', deviceId: 'DEV-3301C', riskScore: 88, status: 'Flagged', riskContribution: 20, description: 'Multi-hop onward dispersion' },
  { id: 'TXN-90104', senderAccount: 'ACC-10881', receiverAccount: 'ACC-10900', amount: 88000, timestamp: minutesAgo(45), transactionType: 'NEFT', location: 'Hyderabad, TS', deviceId: 'DEV-4412D', riskScore: 82, status: 'Flagged', riskContribution: 18, description: 'Rapid routing to newly active account' },
  { id: 'TXN-90105', senderAccount: 'ACC-10900', receiverAccount: 'ACC-10082', amount: 85000, timestamp: minutesAgo(58), transactionType: 'RTGS', location: 'Mumbai, MH', deviceId: 'DEV-8821A', riskScore: 94, status: 'Flagged', riskContribution: 25, description: 'Potential circular transaction flow back to originator' },
  { id: 'TXN-90106', senderAccount: 'ACC-10082', receiverAccount: 'ACC-10004', amount: 450000, timestamp: hoursAgo(2), transactionType: 'RTGS', location: 'Mumbai, MH', deviceId: 'DEV-8821A', riskScore: 65, status: 'Completed', riskContribution: 8, description: 'High value commercial payment' },
  { id: 'TXN-90107', senderAccount: 'ACC-10004', receiverAccount: 'ACC-10082', amount: 800000, timestamp: hoursAgo(5), transactionType: 'RTGS', location: 'Pune, MH', deviceId: 'DEV-1004A', riskScore: 40, status: 'Completed', riskContribution: 4, description: 'Client retainer invoice' },
  { id: 'TXN-90108', senderAccount: 'ACC-10082', receiverAccount: 'ACC-10211', amount: 99000, timestamp: hoursAgo(6), transactionType: 'NEFT', location: 'Mumbai, MH', deviceId: 'DEV-8821A', riskScore: 91, status: 'Flagged', riskContribution: 21, description: 'Repeated structured amount' },
  { id: 'TXN-90109', senderAccount: 'ACC-10082', receiverAccount: 'ACC-10542', amount: 97500, timestamp: hoursAgo(8), transactionType: 'IMPS', location: 'Mumbai, MH', deviceId: 'DEV-8821A', riskScore: 88, status: 'Flagged', riskContribution: 17, description: 'Structured split transfer' },
  { id: 'TXN-90110', senderAccount: 'ACC-10082', receiverAccount: 'ACC-10881', amount: 96000, timestamp: hoursAgo(10), transactionType: 'NEFT', location: 'Mumbai, MH', deviceId: 'DEV-8821A', riskScore: 87, status: 'Flagged', riskContribution: 18, description: 'Off-hours burst transfer' },
];

initialTransactions.push(...flagshipTx);

// Generate 1,020 additional synthetic transactions
const locations = ['Mumbai, MH', 'New Delhi, DL', 'Bengaluru, KA', 'Hyderabad, TS', 'Chennai, TN', 'Kolkata, WB', 'Pune, MH', 'Ahmedabad, GJ', 'Jaipur, RJ'];
const txTypes = ['NEFT', 'RTGS', 'IMPS', 'UPI'];

for (let i = 11; i <= 1030; i++) {
  const txId = `TXN-${100000 + i}`;
  const senderIndex = (i % 95);
  let receiverIndex = ((i * 7) % 95);
  if (senderIndex === receiverIndex) receiverIndex = (receiverIndex + 1) % 95;
  
  const sender = initialAccounts[senderIndex].id;
  const receiver = initialAccounts[receiverIndex].id;
  const amount = (i % 17 === 0) ? Math.floor(80000 + (i % 19) * 1000) : Math.floor(2500 + (i * 73) % 150000);
  const isSuspicious = (i % 13 === 0) || (amount > 85000 && amount < 100000);
  const score = isSuspicious ? Math.floor(70 + (i % 28)) : Math.floor(5 + (i % 30));
  
  initialTransactions.push({
    id: txId,
    senderAccount: sender,
    receiverAccount: receiver,
    amount: amount,
    timestamp: hoursAgo(Math.floor(i / 3) + 1),
    transactionType: txTypes[i % 4],
    location: locations[i % locations.length],
    deviceId: `DEV-${2000 + (i % 40)}${String.fromCharCode(65 + (i % 6))}`,
    riskScore: score,
    status: isSuspicious ? 'Flagged' : 'Completed',
    riskContribution: isSuspicious ? Math.floor(15 + (i % 12)) : Math.floor(1 + (i % 5)),
    description: isSuspicious ? 'Automated risk indicator triggered' : 'Standard domestic settlement',
  });
}

// 50 Synthetic Real-time Alerts
export const initialAlerts = [
  {
    id: 'ALT-501',
    caseId: 'CASE-1042',
    severity: 'HIGH',
    account: 'ACC-10082',
    accountName: 'Apex Global Logistics Pvt Ltd',
    type: 'High Transaction Velocity',
    description: '42 outbound transactions executed within 24 hours (threshold: 15/day).',
    timestamp: minutesAgo(5),
    status: 'New',
  },
  {
    id: 'ALT-502',
    caseId: 'CASE-1042',
    severity: 'HIGH',
    account: 'ACC-10082',
    accountName: 'Apex Global Logistics Pvt Ltd',
    type: 'Suspicious Network Pattern',
    description: 'Directed circular fund route detected across 5 hops returning to originator.',
    timestamp: minutesAgo(15),
    status: 'New',
  },
  {
    id: 'ALT-503',
    caseId: 'CASE-1043',
    severity: 'HIGH',
    account: 'ACC-10145',
    accountName: 'Rapid Flow Financials',
    type: 'Unusual Amount Structuring',
    description: 'Cluster of 12 transactions between ₹49,000 and ₹49,800 within 45 minutes.',
    timestamp: minutesAgo(35),
    status: 'New',
  },
  {
    id: 'ALT-504',
    caseId: 'CASE-1044',
    severity: 'MEDIUM',
    account: 'ACC-10332',
    accountName: 'Devendra Kumar (Proprietor)',
    type: 'Behavioural Deviation',
    description: 'Dormant account reactivation with immediate ₹18,50,000 inflow.',
    timestamp: hoursAgo(1),
    status: 'Under Review',
  },
  {
    id: 'ALT-505',
    caseId: 'CASE-1046',
    severity: 'CRITICAL',
    account: 'ACC-10021',
    accountName: 'Enterprise Partner #21',
    type: 'Multiple Connected Accounts',
    description: 'Rapid fan-out distribution to 8 unverified receiver accounts in 60 minutes.',
    timestamp: hoursAgo(2),
    status: 'New',
  },
];

// Generate up to 50 alerts
for (let i = 6; i <= 50; i++) {
  const acc = initialAccounts[i % initialAccounts.length];
  const sev = (i % 7 === 0) ? 'CRITICAL' : (i % 3 === 0 ? 'HIGH' : (i % 2 === 0 ? 'MEDIUM' : 'LOW'));
  const types = [
    'High transaction velocity',
    'Unusual amount',
    'New account relationship',
    'Multiple connected accounts',
    'Behavioural deviation',
    'Suspicious network pattern'
  ];
  initialAlerts.push({
    id: `ALT-${500 + i}`,
    caseId: (i % 2 === 0) ? `CASE-${1040 + (i % 15) + 1}` : null,
    severity: sev,
    account: acc.id,
    accountName: acc.name,
    type: types[i % types.length],
    description: `Automated heuristic threshold breached for indicator ${types[i % types.length]}.`,
    timestamp: hoursAgo(i),
    status: (i % 4 === 0) ? 'Dismissed' : (i % 3 === 0 ? 'Reviewed' : 'New'),
  });
}

// 50 Chronological Audit Logs
export const initialAuditLogs = [
  {
    id: 'LOG-901',
    timestamp: minutesAgo(2),
    user: 'Demo Investigator (investigator@arthadrishti.ai)',
    action: 'Viewed Case Details',
    caseId: 'CASE-1042',
    ipAddress: '192.168.1.45',
    details: 'Accessed investigation dashboard and network graph for CASE-1042',
  },
  {
    id: 'LOG-902',
    timestamp: minutesAgo(8),
    user: 'Demo Investigator (investigator@arthadrishti.ai)',
    action: 'Generated AI Synthesis',
    caseId: 'CASE-1042',
    ipAddress: '192.168.1.45',
    details: 'Ran Artha AI automated structured case synthesis and risk factor extraction',
  },
  {
    id: 'LOG-903',
    timestamp: minutesAgo(20),
    user: 'Demo Investigator (investigator@arthadrishti.ai)',
    action: 'Applied Filter',
    caseId: 'GLOBAL',
    ipAddress: '192.168.1.45',
    details: 'Filtered transactions by risk level HIGH and amount > ₹80,000',
  },
  {
    id: 'LOG-904',
    timestamp: hoursAgo(1),
    user: 'Senior Analyst R. Mehta (r.mehta@arthadrishti.ai)',
    action: 'Escalated Case',
    caseId: 'CASE-1044',
    ipAddress: '192.168.1.12',
    details: 'Escalated CASE-1044 to Compliance Operations for manual KYC inquiry',
  },
  {
    id: 'LOG-905',
    timestamp: hoursAgo(2),
    user: 'Demo Investigator (investigator@arthadrishti.ai)',
    action: 'Generated Report',
    caseId: 'CASE-1042',
    ipAddress: '192.168.1.45',
    details: 'Generated official Financial Investigation Summary Report PDF',
  },
  {
    id: 'LOG-906',
    timestamp: hoursAgo(3),
    user: 'Analyst K. Sharma (k.sharma@arthadrishti.ai)',
    action: 'Resolved Case',
    caseId: 'CASE-1048',
    ipAddress: '192.168.1.18',
    details: 'Marked CASE-1048 as Resolved following verified festive merchant POS statements',
  },
  {
    id: 'LOG-907',
    timestamp: hoursAgo(4),
    user: 'Demo Investigator (investigator@arthadrishti.ai)',
    action: 'Updated Risk Weights',
    caseId: 'SYSTEM',
    ipAddress: '192.168.1.45',
    details: 'Simulated custom risk weights in Risk Analytics sandbox',
  }
];

// Generate additional audit logs
for (let i = 8; i <= 50; i++) {
  const actions = ['Viewed Case', 'Filtered Transactions', 'Exported CSV', 'Updated Notes', 'Viewed Network Graph', 'Reviewed Alert'];
  initialAuditLogs.push({
    id: `LOG-${900 + i}`,
    timestamp: hoursAgo(i * 2),
    user: (i % 2 === 0) ? 'Demo Investigator (investigator@arthadrishti.ai)' : 'Analyst K. Sharma (k.sharma@arthadrishti.ai)',
    action: actions[i % actions.length],
    caseId: `CASE-${1040 + (i % 10) + 1}`,
    ipAddress: '192.168.1.45',
    details: `Executed ${actions[i % actions.length]} during routine investigation workflow.`,
  });
}

// Default Configurable Risk Weights
export const defaultRiskWeights = {
  behaviour: 30,
  velocity: 25,
  network: 20,
  amount: 15,
  historicalDeviation: 10,
};

// Default Risk Thresholds
export const defaultRiskThresholds = {
  low: { min: 0, max: 39 },
  medium: { min: 40, max: 69 },
  high: { min: 70, max: 89 },
  critical: { min: 90, max: 100 },
};
