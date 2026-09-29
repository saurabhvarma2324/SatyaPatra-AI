const store = require('../services/store');
const { getIPIntelligence } = require('../services/intelligenceService');

const getGeoByCaseId = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const iocs = store.getIOCsByCaseId(caseId);
    const ipIocs = iocs.filter(i => i.type === 'ip');

    const locations = [];
    for (const ip of ipIocs) {
      const intel = await getIPIntelligence(ip.value);
      locations.push({
        ip: ip.value,
        country: intel.country,
        city: intel.city,
        region: intel.region || intel.city,
        lat: intel.lat || (intel.city === 'Amsterdam' ? 52.3676 : (intel.city === 'Frankfurt' ? 50.1109 : 44.4268)),
        lng: intel.lng || (intel.city === 'Amsterdam' ? 4.9041 : (intel.city === 'Frankfurt' ? 8.6821 : 26.1025)),
        isp: intel.isp,
        asn: intel.asn,
        risk: ip.risk,
        source: ip.source,
        caseId,
        demo: true
      });
    }

    return res.status(200).json({
      success: true,
      caseId,
      disclaimer: 'Approximate network/geographic location. For forensic investigation only.',
      locations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllGeo = async (req, res) => {
  try {
    const allIocs = store.getAllIOCs({ type: 'ip' });
    const locations = [];
    const seen = new Set();

    for (const ip of allIocs) {
      if (!seen.has(ip.value)) {
        seen.add(ip.value);
        const intel = await getIPIntelligence(ip.value);
        locations.push({
          ip: ip.value,
          country: intel.country,
          city: intel.city,
          lat: intel.city === 'Amsterdam' ? 52.3676 : (intel.city === 'Frankfurt' ? 50.1109 : (intel.city === 'Moscow' ? 55.7558 : (intel.city === 'Victoria' ? -4.6191 : 44.4268))),
          lng: intel.city === 'Amsterdam' ? 4.9041 : (intel.city === 'Frankfurt' ? 8.6821 : (intel.city === 'Moscow' ? 37.6173 : (intel.city === 'Victoria' ? 55.4513 : 26.1025))),
          isp: intel.isp,
          asn: intel.asn,
          risk: ip.risk,
          caseId: ip.caseId,
          source: ip.source,
          demo: true
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: locations.length,
      disclaimer: 'Approximate network/geographic location. For forensic investigation only.',
      locations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGeoByCaseId, getAllGeo };
