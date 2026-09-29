const { getSeedData } = require('./seedData');

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    const seed = getSeedData();
    this.users = seed.users;
    this.cases = seed.cases;
    this.emails = seed.emails;
    this.threats = seed.threats;
    this.iocs = seed.iocs;
    this.timelineEvents = seed.timelineEvents;
    this.reports = [];
    this.notifications = seed.notifications;
    console.log(`[DataStore] Initialized with ${this.cases.length} cases, ${this.iocs.length} IOCs, ${this.users.length} users.`);
  }

  // User Operations
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  getAllUsers() {
    return this.users.map(({ passwordHash, ...rest }) => rest);
  }

  createUser(userData) {
    const newUser = {
      id: `usr-${Date.now()}`,
      ...userData,
      status: userData.status || 'ACTIVE',
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUserStatus(id, status) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = status;
      return user;
    }
    return null;
  }

  // Case Operations
  getAllCases({ search, risk, status, priority } = {}) {
    let list = [...this.cases];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.caseId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    if (risk && risk !== 'ALL') {
      list = list.filter(c => c.threatLevel === risk);
    }

    if (status && status !== 'ALL') {
      list = list.filter(c => c.status === status);
    }

    if (priority && priority !== 'ALL') {
      list = list.filter(c => c.priority === priority);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  getCaseById(caseId) {
    return this.cases.find(c => c.caseId === caseId || c.id === caseId);
  }

  createCase(caseData) {
    const caseCount = this.cases.length + 1;
    const year = new Date().getFullYear();
    const formattedId = `CASE-${year}-${String(caseCount).padStart(3, '0')}`;

    const newCase = {
      id: `case-${Date.now()}`,
      caseId: caseData.caseId || formattedId,
      title: caseData.title || 'Untitled Investigation',
      description: caseData.description || '',
      priority: caseData.priority || 'HIGH',
      status: 'UNDER_INVESTIGATION',
      threatLevel: caseData.threatLevel || 'SUSPICIOUS',
      threatType: caseData.threatType || 'Pending Analysis',
      riskScore: caseData.riskScore || 0,
      confidence: caseData.confidence || 0,
      investigatorId: caseData.investigatorId || 'investigator@maildrishti.ai',
      investigatorName: caseData.investigatorName || 'Dr. Alok Verma',
      notes: caseData.notes || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cases.unshift(newCase);
    
    // Add notification
    this.addNotification({
      title: 'New Case Initialized',
      message: `Case ${newCase.caseId} opened: ${newCase.title}`,
      type: 'CASE_UPDATE',
      caseId: newCase.caseId
    });

    return newCase;
  }

  updateCase(caseId, updateData) {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) return null;

    Object.assign(caseItem, updateData, { updatedAt: new Date() });
    return caseItem;
  }

  addCaseNote(caseId, noteText, author = 'Dr. Alok Verma') {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) return null;

    const note = {
      id: `note-${Date.now()}`,
      author,
      text: noteText,
      timestamp: new Date()
    };
    if (!caseItem.notes) caseItem.notes = [];
    caseItem.notes.push(note);
    caseItem.updatedAt = new Date();

    // Also add to timeline
    this.addTimelineEvent({
      caseId: caseItem.caseId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      eventType: 'INVESTIGATOR_NOTE',
      title: 'Investigator Note Appended',
      description: `${author}: "${noteText.substring(0, 80)}${noteText.length > 80 ? '...' : ''}"`,
      source: 'Investigator Review'
    });

    return note;
  }

  // Email Operations
  getEmailByCaseId(caseId) {
    return this.emails.find(e => e.caseId === caseId);
  }

  saveEmail(emailData) {
    const newEmail = {
      id: `eml-${Date.now()}`,
      ...emailData,
      uploadedAt: new Date()
    };
    this.emails.push(newEmail);
    return newEmail;
  }

  // Threat Results
  getThreatResultByCaseId(caseId) {
    return this.threats.find(t => t.caseId === caseId);
  }

  saveThreatResult(threatData) {
    const newThreat = {
      id: `thr-${Date.now()}`,
      ...threatData,
      createdAt: new Date()
    };
    this.threats = this.threats.filter(t => t.caseId !== threatData.caseId);
    this.threats.push(newThreat);
    return newThreat;
  }

  // IOCs Operations
  getIOCsByCaseId(caseId) {
    return this.iocs.filter(ioc => ioc.caseId === caseId);
  }

  getAllIOCs({ type, risk, search } = {}) {
    let list = [...this.iocs];
    if (type && type !== 'ALL') {
      list = list.filter(ioc => ioc.type.toLowerCase() === type.toLowerCase());
    }
    if (risk && risk !== 'ALL') {
      list = list.filter(ioc => ioc.risk === risk);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(ioc =>
        ioc.value.toLowerCase().includes(q) ||
        ioc.caseId.toLowerCase().includes(q) ||
        ioc.source.toLowerCase().includes(q)
      );
    }
    return list;
  }

  saveIOCs(caseId, iocList) {
    const newItems = iocList.map((ioc, idx) => ({
      id: `ioc-${Date.now()}-${idx}`,
      caseId,
      type: ioc.type,
      value: ioc.value,
      source: ioc.source || 'Analysis Engine',
      risk: ioc.risk || 'SUSPICIOUS',
      status: ioc.status || 'Active',
      metadata: ioc.metadata || {},
      createdAt: new Date()
    }));
    this.iocs = this.iocs.filter(ioc => ioc.caseId !== caseId);
    this.iocs.push(...newItems);
    return newItems;
  }

  // Timeline Events
  getTimelineEventsByCaseId(caseId) {
    const events = this.timelineEvents.filter(e => e.caseId === caseId);
    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return events;
  }

  getAllTimelineEvents() {
    const events = [...this.timelineEvents];
    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return events;
  }

  addTimelineEvent(eventData) {
    const newEvent = {
      id: `evt-${Date.now()}`,
      ...eventData,
      createdAt: new Date()
    };
    this.timelineEvents.push(newEvent);
    return newEvent;
  }

  saveTimelineEvents(caseId, events) {
    const newEvents = events.map((e, idx) => ({
      id: e.id || `evt-${Date.now()}-${idx}`,
      caseId,
      timestamp: e.timestamp,
      eventType: e.eventType,
      title: e.title,
      description: e.description || '',
      source: e.source || 'Analysis Engine',
      createdAt: new Date()
    }));
    this.timelineEvents = this.timelineEvents.filter(e => e.caseId !== caseId);
    this.timelineEvents.push(...newEvents);
    return newEvents;
  }

  // Reports
  getReportByCaseId(caseId) {
    return this.reports.find(r => r.caseId === caseId);
  }

  saveReport(reportData) {
    const existing = this.reports.find(r => r.caseId === reportData.caseId);
    if (existing) {
      Object.assign(existing, reportData, { updatedAt: new Date() });
      return existing;
    }
    const newReport = {
      id: `rep-${Date.now()}`,
      ...reportData,
      createdAt: new Date()
    };
    this.reports.push(newReport);
    return newReport;
  }

  // Notifications
  getNotifications() {
    return [...this.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addNotification(notifData) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      ...notifData,
      read: false,
      createdAt: new Date()
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  markNotificationRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return notif;
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => n.read = true);
    return true;
  }

  // Dashboard Aggregations
  getDashboardStats() {
    const totalCases = this.cases.length;
    const emailsAnalyzed = this.cases.filter(c => c.riskScore > 0).length;
    const highRiskThreats = this.cases.filter(c => c.threatLevel === 'HIGH' || c.threatLevel === 'CRITICAL').length;
    const criticalThreats = this.cases.filter(c => c.threatLevel === 'CRITICAL').length;
    const iocsExtracted = this.iocs.length;
    
    const uniqueDomains = new Set(this.iocs.filter(ioc => ioc.type === 'domain').map(ioc => ioc.value)).size;
    const uniqueIPs = new Set(this.iocs.filter(ioc => ioc.type === 'ip').map(ioc => ioc.value)).size;
    const activeInvestigations = this.cases.filter(c => c.status === 'UNDER_INVESTIGATION').length;

    // Threat Distribution
    const threatTypes = { Safe: 0, Phishing: 0, Malware: 0, Spam: 0, Suspicious: 0 };
    this.cases.forEach(c => {
      const type = c.threatType || 'Suspicious';
      if (threatTypes[type] !== undefined) {
        threatTypes[type]++;
      } else {
        threatTypes.Suspicious++;
      }
    });

    const threatDistribution = Object.keys(threatTypes).map(name => ({
      name,
      value: threatTypes[name]
    }));

    // Risk Distribution
    const riskDistribution = [
      { name: 'Low', count: this.cases.filter(c => c.threatLevel === 'SAFE' || (c.riskScore >= 0 && c.riskScore <= 25)).length },
      { name: 'Medium', count: this.cases.filter(c => c.threatLevel === 'SUSPICIOUS' || (c.riskScore > 25 && c.riskScore <= 50)).length },
      { name: 'High', count: this.cases.filter(c => c.threatLevel === 'HIGH' || (c.riskScore > 50 && c.riskScore <= 75)).length },
      { name: 'Critical', count: this.cases.filter(c => c.threatLevel === 'CRITICAL' || c.riskScore > 75).length }
    ];

    // Threats Over Time (Past 7 Days)
    const threatsOverTime = [
      { date: 'Mon', phishing: 2, malware: 1, spam: 4, safe: 3 },
      { date: 'Tue', phishing: 3, malware: 2, spam: 2, safe: 5 },
      { date: 'Wed', phishing: 5, malware: 1, spam: 6, safe: 4 },
      { date: 'Thu', phishing: 4, malware: 3, spam: 3, safe: 6 },
      { date: 'Fri', phishing: 7, malware: 2, spam: 5, safe: 8 },
      { date: 'Sat', phishing: 3, malware: 1, spam: 2, safe: 2 },
      { date: 'Sun', phishing: 6, malware: 4, spam: 3, safe: 4 }
    ];

    // Recent 5 Investigations
    const recentInvestigations = this.cases.slice(0, 5);

    return {
      kpi: {
        totalCases,
        emailsAnalyzed,
        highRiskThreats,
        criticalThreats,
        iocsExtracted,
        suspiciousDomains: uniqueDomains,
        suspiciousIPs: uniqueIPs,
        activeInvestigations
      },
      threatDistribution,
      riskDistribution,
      threatsOverTime,
      recentInvestigations
    };
  }
}

const store = new DataStore();
module.exports = store;
