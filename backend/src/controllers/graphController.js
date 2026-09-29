const store = require('../services/store');

const getGraphByCaseId = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const caseItem = store.getCaseById(caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    const email = store.getEmailByCaseId(caseItem.caseId);
    const iocs = store.getIOCsByCaseId(caseItem.caseId);
    const threat = store.getThreatResultByCaseId(caseItem.caseId);

    const nodes = [];
    const edges = [];

    // 1. Case Node
    const caseNodeId = `case-${caseItem.caseId}`;
    nodes.push({
      id: caseNodeId,
      type: 'caseNode',
      data: {
        label: caseItem.caseId,
        title: caseItem.title,
        priority: caseItem.priority,
        riskScore: caseItem.riskScore,
        type: 'case'
      },
      position: { x: 50, y: 250 }
    });

    // 2. Email Node
    const emailNodeId = `email-${caseItem.caseId}`;
    const emailLabel = email ? (email.subject.length > 24 ? email.subject.substring(0, 24) + '...' : email.subject) : 'Inbound Email';
    nodes.push({
      id: emailNodeId,
      type: 'emailNode',
      data: {
        label: emailLabel,
        subject: email ? email.subject : caseItem.title,
        threatType: caseItem.threatType,
        type: 'email'
      },
      position: { x: 300, y: 250 }
    });

    edges.push({
      id: `edge-${caseNodeId}-${emailNodeId}`,
      source: caseNodeId,
      target: emailNodeId,
      label: 'INVESTIGATES',
      animated: true,
      style: { stroke: '#38bdf8' }
    });

    // 3. Sender Node
    if (email && email.sender) {
      const senderId = `sender-${caseItem.caseId}`;
      nodes.push({
        id: senderId,
        type: 'senderNode',
        data: { label: email.sender, type: 'sender' },
        position: { x: 550, y: 80 }
      });
      edges.push({
        id: `edge-${emailNodeId}-${senderId}`,
        source: emailNodeId,
        target: senderId,
        label: 'SENT_BY',
        style: { stroke: '#fbbf24' }
      });
    }

    // 4. Recipient Node
    if (email && email.recipient) {
      const recipId = `recip-${caseItem.caseId}`;
      nodes.push({
        id: recipId,
        type: 'recipientNode',
        data: { label: email.recipient, type: 'recipient' },
        position: { x: 550, y: 440 }
      });
      edges.push({
        id: `edge-${emailNodeId}-${recipId}`,
        source: emailNodeId,
        target: recipId,
        label: 'DELIVERED_TO',
        style: { stroke: '#94a3b8' }
      });
    }

    // 5. URLs
    const urls = iocs.filter(i => i.type === 'url');
    urls.slice(0, 3).forEach((u, idx) => {
      const uId = `url-${idx}`;
      const shortUrl = u.value.replace(/^https?:\/\//, '').substring(0, 22);
      nodes.push({
        id: uId,
        type: 'urlNode',
        data: { label: shortUrl, fullUrl: u.value, risk: u.risk, type: 'url' },
        position: { x: 550, y: 180 + idx * 80 }
      });
      edges.push({
        id: `edge-${emailNodeId}-${uId}`,
        source: emailNodeId,
        target: uId,
        label: 'CONTAINS_URL',
        style: { stroke: '#f87171' }
      });
    });

    // 6. Domains
    const domains = iocs.filter(i => i.type === 'domain');
    domains.slice(0, 3).forEach((d, idx) => {
      const dId = `domain-${idx}`;
      nodes.push({
        id: dId,
        type: 'domainNode',
        data: { label: d.value, risk: d.risk, type: 'domain' },
        position: { x: 800, y: 180 + idx * 90 }
      });

      const sourceId = urls.length > 0 ? `url-0` : emailNodeId;
      edges.push({
        id: `edge-${sourceId}-${dId}`,
        source: sourceId,
        target: dId,
        label: urls.length > 0 ? 'HOSTED_ON' : 'USES_DOMAIN',
        style: { stroke: '#fb923c' }
      });
    });

    // 7. IPs
    const ips = iocs.filter(i => i.type === 'ip');
    ips.slice(0, 3).forEach((ip, idx) => {
      const ipId = `ip-${idx}`;
      nodes.push({
        id: ipId,
        type: 'ipNode',
        data: { label: ip.value, risk: ip.risk, type: 'ip' },
        position: { x: 1050, y: 180 + idx * 90 }
      });

      const domSource = domains.length > idx ? `domain-${idx}` : (domains.length > 0 ? 'domain-0' : emailNodeId);
      edges.push({
        id: `edge-${domSource}-${ipId}`,
        source: domSource,
        target: ipId,
        label: 'RESOLVES_TO',
        style: { stroke: '#e879f9' }
      });

      // Geo Node
      const geoId = `geo-${idx}`;
      const geoMeta = ip.metadata || {};
      const geoLabel = `${geoMeta.city || 'Amsterdam'}, ${geoMeta.country || 'Netherlands'}`;
      nodes.push({
        id: geoId,
        type: 'geoNode',
        data: { label: geoLabel, lat: 52.3676, lng: 4.9041, type: 'geo' },
        position: { x: 1300, y: 180 + idx * 90 }
      });
      edges.push({
        id: `edge-${ipId}-${geoId}`,
        source: ipId,
        target: geoId,
        label: 'ORIGIN_LOCATION',
        style: { stroke: '#34d399' }
      });
    });

    // 8. Attachments
    const attachments = iocs.filter(i => i.type === 'attachment');
    attachments.slice(0, 2).forEach((att, idx) => {
      const attId = `att-${idx}`;
      nodes.push({
        id: attId,
        type: 'attachmentNode',
        data: { label: att.value, risk: att.risk, type: 'attachment' },
        position: { x: 550, y: 540 + idx * 70 }
      });
      edges.push({
        id: `edge-${emailNodeId}-${attId}`,
        source: emailNodeId,
        target: attId,
        label: 'HAS_ATTACHMENT',
        style: { stroke: '#f43f5e' }
      });
    });

    return res.status(200).json({
      success: true,
      caseId,
      graph: {
        nodes,
        edges,
        stats: {
          total_nodes: nodes.length,
          total_edges: edges.length,
          entity_types: ['case', 'email', 'sender', 'recipient', 'url', 'domain', 'ip', 'geo', 'attachment']
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGraphByCaseId };
