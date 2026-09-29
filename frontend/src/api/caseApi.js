import apiClient from './client';

export const caseApi = {
  getAllCases: async () => {
    try {
      const res = await apiClient.get('/cases');
      return res.data;
    } catch (e) {
      console.warn('API unavailable, fallback to local dataset');
      return null;
    }
  },

  getCaseById: async (id) => {
    try {
      const res = await apiClient.get(`/cases/${id}`);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  createCase: async (caseData) => {
    try {
      const res = await apiClient.post('/cases', caseData);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  updateCase: async (id, updateData) => {
    try {
      const res = await apiClient.put(`/cases/${id}`, updateData);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  getCaseNetwork: async (id) => {
    try {
      const res = await apiClient.get(`/cases/${id}/network`);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  getCaseRisk: async (id) => {
    try {
      const res = await apiClient.get(`/cases/${id}/risk`);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  getCaseTimeline: async (id) => {
    try {
      const res = await apiClient.get(`/cases/${id}/timeline`);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  getCaseReport: async (id) => {
    try {
      const res = await apiClient.get(`/cases/${id}/report`);
      return res.data;
    } catch (e) {
      return null;
    }
  },
};

export default caseApi;
