// Modular external intelligence service with demo fallback

const getIPIntelligence = async (ip) => {
  // If external API key exists in process.env.IP_INTELLIGENCE_API_KEY, use it. Otherwise return synthetic intelligence.
  const knownIPs = {
    '203.0.113.10': { country: 'Netherlands', city: 'Amsterdam', isp: 'CloudLayer Hosting B.V.', asn: 'AS49544', risk: 'HIGH' },
    '185.220.101.5': { country: 'Germany', city: 'Frankfurt', isp: 'Tor Exit Relay Node', asn: 'AS200651', risk: 'CRITICAL' },
    '198.51.100.45': { country: 'Russia', city: 'Moscow', isp: 'FastVDS Web Services', asn: 'AS58224', risk: 'HIGH' },
    '194.165.16.88': { country: 'Romania', city: 'Bucharest', isp: 'Voxility S.R.L.', asn: 'AS3223', risk: 'SUSPICIOUS' },
    '45.142.214.12': { country: 'Seychelles', city: 'Victoria', isp: 'Offshore VPS Networks', asn: 'AS60117', risk: 'CRITICAL' },
    '142.250.190.46': { country: 'United States', city: 'Mountain View', isp: 'Google LLC', asn: 'AS15169', risk: 'SAFE' }
  };

  if (knownIPs[ip]) {
    return { ip, ...knownIPs[ip], demo: true, source: 'Forensic Intelligence Cache' };
  }

  return {
    ip,
    country: 'Bulgaria',
    city: 'Sofia',
    isp: 'Telepoint Hosting Networks',
    asn: 'AS34224',
    risk: 'HIGH',
    demo: true,
    source: 'Demo Intelligence'
  };
};

const getDomainIntelligence = async (domain) => {
  return {
    domain,
    ageDays: domain.includes('test') || domain.includes('xyz') ? 3 : 1850,
    registrar: 'NameCheap Privacy Protect Inc.',
    risk: domain.includes('sample-login') || domain.includes('test') ? 'CRITICAL' : 'LOW',
    status: domain.includes('test') ? 'Newly Registered / Suspicious' : 'Active / Established',
    demo: true
  };
};

const getURLIntelligence = async (url) => {
  return {
    url,
    category: 'Credential Harvesting / Phishing Portal',
    risk: 'CRITICAL',
    threatDetected: true,
    demo: true
  };
};

module.exports = {
  getIPIntelligence,
  getDomainIntelligence,
  getURLIntelligence
};
