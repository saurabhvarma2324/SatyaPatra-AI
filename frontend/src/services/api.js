import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('maildrishti_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('maildrishti_token');
        localStorage.removeItem('maildrishti_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword }),
};

export const casesAPI = {
  getCases: (params) => api.get('/cases', { params }),
  getCaseById: (id) => api.get(`/cases/${id}`),
  createCase: (data) => api.post('/cases', data),
  updateCase: (id, data) => api.put(`/cases/${id}`, data),
  addNote: (id, text) => api.post(`/cases/${id}/notes`, { text }),
};

export const emailsAPI = {
  uploadEmail: (formData) => api.post('/emails/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSampleEmails: () => api.get('/emails/samples'),
  loadSample: (filename, title) => api.post('/emails/load-sample', { filename, title }),
};

export const iocsAPI = {
  getIOCs: (params) => api.get('/iocs', { params }),
  getIOCsByCaseId: (caseId) => api.get(`/iocs/${caseId}`),
  getEnrichment: (type, value) => api.get('/iocs/enrich', { params: { type, value } }),
};

export const graphAPI = {
  getGraphByCaseId: (caseId) => api.get(`/graph/${caseId}`),
};

export const geoAPI = {
  getGeoByCaseId: (caseId) => api.get(`/geo/${caseId}`),
  getAllGeo: () => api.get('/geo'),
};

export const timelineAPI = {
  getTimelineByCaseId: (caseId) => api.get(`/timeline/${caseId}`),
  getAllTimeline: () => api.get('/timeline'),
};

export const reportsAPI = {
  getReportByCaseId: (caseId) => api.get(`/reports/${caseId}`),
  generateReport: (caseId, summary) => api.post(`/reports/${caseId}`, { summary }),
  getAllReports: () => api.get('/reports'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const usersAPI = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateStatus: (id, status) => api.put(`/users/${id}/status`, { status }),
};

export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;
