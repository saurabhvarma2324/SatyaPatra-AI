import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialAccounts,
  initialCases,
  initialTransactions,
  initialAlerts,
  initialAuditLogs,
  defaultRiskWeights,
  defaultRiskThresholds,
  case1042Indicators
} from '../data/syntheticData';
import apiClient from '../api/client';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Load from local storage or initial synthetic data
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('arthadrishti_accounts');
    return saved ? JSON.parse(saved) : initialAccounts;
  });

  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('arthadrishti_cases');
    return saved ? JSON.parse(saved) : initialCases;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('arthadrishti_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('arthadrishti_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('arthadrishti_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [riskWeights, setRiskWeights] = useState(() => {
    const saved = localStorage.getItem('arthadrishti_risk_weights');
    return saved ? JSON.parse(saved) : defaultRiskWeights;
  });

  const [riskThresholds, setRiskThresholds] = useState(() => {
    const saved = localStorage.getItem('arthadrishti_risk_thresholds');
    return saved ? JSON.parse(saved) : defaultRiskThresholds;
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isMlServiceOnline, setIsMlServiceOnline] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('arthadrishti_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('arthadrishti_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('arthadrishti_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('arthadrishti_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('arthadrishti_risk_weights', JSON.stringify(riskWeights));
  }, [riskWeights]);

  useEffect(() => {
    localStorage.setItem('arthadrishti_risk_thresholds', JSON.stringify(riskThresholds));
  }, [riskThresholds]);

  // Check health of backend & ML service non-intrusively
  useEffect(() => {
    const checkServices = async () => {
      try {
        const res = await apiClient.get('/health', { timeout: 1500 });
        if (res.status === 200) setIsBackendOnline(true);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };
    checkServices();
  }, []);

  // Helper to add audit logs
  const addAuditLog = (action, caseId = 'SYSTEM', details = '') => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      user: 'Demo Investigator (investigator@arthadrishti.ai)',
      action,
      caseId,
      ipAddress: '192.168.1.45',
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Case operations
  const getCaseById = (id) => {
    return cases.find(c => c.id === id || c.caseNumber === id) || null;
  };

  const updateCaseStatus = (caseId, newStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId || c.caseNumber === caseId) {
        return { ...c, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
    addAuditLog(`Updated Status to ${newStatus}`, caseId, `Investigator transitioned case status to ${newStatus}`);
  };

  const updateCaseNotes = (caseId, notes) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId || c.caseNumber === caseId) {
        return { ...c, notes, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
    addAuditLog('Updated Case Notes', caseId, 'Investigator updated formal case examination notes');
  };

  const createCase = (newCaseData) => {
    const newId = `CASE-${1040 + cases.length + 1}`;
    const primaryAcc = accounts.find(a => a.id === newCaseData.primaryAccount) || {
      id: newCaseData.primaryAccount,
      name: 'Custom Account',
      riskScore: newCaseData.riskScore || 75
    };
    
    const riskScore = newCaseData.riskScore || primaryAcc.riskScore || 75;
    const riskLevel = riskScore >= 90 ? 'CRITICAL' : riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';

    const createdCase = {
      id: newId,
      caseNumber: newId,
      primaryAccount: newCaseData.primaryAccount,
      accountName: primaryAcc.name,
      riskScore: riskScore,
      riskLevel: riskLevel,
      status: 'New',
      assignedInvestigator: newCaseData.assignedInvestigator || 'Demo Investigator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactionCount: 15,
      totalVolume: newCaseData.totalVolume || 1500000,
      description: newCaseData.description || 'Investigator-initiated risk assessment dossier.',
      indicatorsCount: 3,
      indicators: [
        { id: `IND-${Date.now()}-1`, caseId: newId, type: 'Manual Review Trigger', severity: riskLevel, value: 'Investigator initiated', description: newCaseData.description || 'Manual case creation' },
        { id: `IND-${Date.now()}-2`, caseId: newId, type: 'Transaction Velocity', severity: 'HIGH', value: 'Elevated rate', description: 'Transaction frequency anomaly observed' }
      ],
      notes: newCaseData.notes || 'Case created for in-depth transaction profiling.',
    };

    setCases(prev => [createdCase, ...prev]);
    addAuditLog('Created Case', newId, `Initialized new case investigation for account ${newCaseData.primaryAccount}`);
    return createdCase;
  };

  // Alert operations
  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Dismissed' } : a));
    addAuditLog('Dismissed Alert', 'ALERTS', `Dismissed alert ${alertId}`);
  };

  const reviewAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Under Review' } : a));
    addAuditLog('Reviewed Alert', 'ALERTS', `Marked alert ${alertId} as Under Review`);
  };

  const createCaseFromAlert = (alert) => {
    const createdCase = createCase({
      primaryAccount: alert.account,
      description: `Case spawned from Alert ${alert.id}: ${alert.description}`,
      riskScore: alert.severity === 'CRITICAL' ? 95 : alert.severity === 'HIGH' ? 88 : 65,
    });
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'Reviewed', caseId: createdCase.id } : a));
    return createdCase;
  };

  // Transaction lookups
  const getTransactionsForCase = (caseId, primaryAccountId) => {
    if (caseId === 'CASE-1042' || primaryAccountId === 'ACC-10082') {
      return transactions.filter(t => 
        t.senderAccount === 'ACC-10082' || t.receiverAccount === 'ACC-10082' ||
        t.senderAccount === 'ACC-10211' || t.receiverAccount === 'ACC-10211' ||
        t.senderAccount === 'ACC-10542' || t.receiverAccount === 'ACC-10542' ||
        t.senderAccount === 'ACC-10881' || t.receiverAccount === 'ACC-10881' ||
        t.senderAccount === 'ACC-10900' || t.receiverAccount === 'ACC-10900'
      );
    }
    if (primaryAccountId) {
      return transactions.filter(t => t.senderAccount === primaryAccountId || t.receiverAccount === primaryAccountId);
    }
    return transactions.slice(0, 50);
  };

  const getAccountById = (id) => {
    return accounts.find(a => a.id === id || a.accountNumber === id) || null;
  };

  // Dynamic Risk Calculation formula
  const calculateRiskScore = (components, weights = riskWeights) => {
    const totalWeight = weights.behaviour + weights.velocity + weights.network + weights.amount + weights.historicalDeviation;
    const raw = (
      (components.behaviour * weights.behaviour) +
      (components.velocity * weights.velocity) +
      (components.network * weights.network) +
      (components.amount * weights.amount) +
      (components.historicalDeviation * weights.historicalDeviation)
    ) / (totalWeight || 100);
    return Math.min(100, Math.max(0, Math.round(raw)));
  };

  // Reset to default dataset
  const resetToDefaultData = () => {
    setAccounts(initialAccounts);
    setCases(initialCases);
    setTransactions(initialTransactions);
    setAlerts(initialAlerts);
    setAuditLogs(initialAuditLogs);
    setRiskWeights(defaultRiskWeights);
    setRiskThresholds(defaultRiskThresholds);
    localStorage.removeItem('arthadrishti_cases');
    localStorage.removeItem('arthadrishti_transactions');
    localStorage.removeItem('arthadrishti_alerts');
    localStorage.removeItem('arthadrishti_audit_logs');
    localStorage.removeItem('arthadrishti_risk_weights');
    localStorage.removeItem('arthadrishti_risk_thresholds');
    addAuditLog('Reset Dataset', 'SYSTEM', 'Restored initial synthetic dataset');
  };

  return (
    <DataContext.Provider value={{
      accounts,
      cases,
      transactions,
      alerts,
      auditLogs,
      riskWeights,
      setRiskWeights,
      riskThresholds,
      setRiskThresholds,
      getCaseById,
      updateCaseStatus,
      updateCaseNotes,
      createCase,
      dismissAlert,
      reviewAlert,
      createCaseFromAlert,
      getTransactionsForCase,
      getAccountById,
      calculateRiskScore,
      addAuditLog,
      resetToDefaultData,
      isBackendOnline,
      isMlServiceOnline,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
