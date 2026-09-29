import apiClient from './client';

export const transactionApi = {
  getTransactions: async (params) => {
    try {
      const res = await apiClient.get('/transactions', { params });
      return res.data;
    } catch (e) {
      return null;
    }
  },

  getTransactionById: async (id) => {
    try {
      const res = await apiClient.get(`/transactions/${id}`);
      return res.data;
    } catch (e) {
      return null;
    }
  },
};

export const accountApi = {
  getAccountById: async (id) => {
    try {
      const res = await apiClient.get(`/accounts/${id}`);
      return res.data;
    } catch (e) {
      return null;
    }
  },
};

export const alertApi = {
  getAlerts: async () => {
    try {
      const res = await apiClient.get('/alerts');
      return res.data;
    } catch (e) {
      return null;
    }
  },
};

export const auditApi = {
  getAuditLogs: async () => {
    try {
      const res = await apiClient.get('/audit-logs');
      return res.data;
    } catch (e) {
      return null;
    }
  },
};

export const riskApi = {
  predictRisk: async (payload) => {
    try {
      const res = await apiClient.post('/risk/predict', payload);
      return res.data;
    } catch (e) {
      return null;
    }
  },
};

export const reportApi = {
  generateReport: async (caseId, payload) => {
    try {
      const res = await apiClient.post(`/cases/${caseId}/generate-report`, payload);
      return res.data;
    } catch (e) {
      return null;
    }
  },
};
