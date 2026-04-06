import api from './api';

const jobMarketApi = {
  // Jobs
  getJobs: (params = {}) => api.get('/jobs', { params }),
  getFeaturedJobs: (limit = 6) => api.get('/jobs/featured', { params: { limit } }),
  getRecentJobs: (limit = 10) => api.get('/jobs/recent', { params: { limit } }),
  getJobStatistics: () => api.get('/jobs/statistics'),
  searchJobs: (params = {}) => api.get('/jobs/search', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),

  // Applications
  submitApplication: (jobId, data) => api.post(`/job-applications/job/${jobId}`, data),
  getUserApplications: (userId, params = {}) => api.get(`/job-applications/user/${userId}`, { params }),
  getJobApplications: (jobId, params = {}) => api.get(`/job-applications/job/${jobId}`, { params }),
  getApplicationById: (id) => api.get(`/job-applications/${id}`),
  getApplicationsByStatus: (status, params = {}) => api.get(`/job-applications/status/${status}`, { params }),
  updateApplicationStatus: (id, data) => api.put(`/job-applications/${id}/status`, data),
  scheduleInterview: (id, data) => api.put(`/job-applications/${id}/interview`, data),
  addApplicationCommunication: (id, data) => api.post(`/job-applications/${id}/communication`, data),
  withdrawApplication: (id) => api.put(`/job-applications/${id}/withdraw`),
  deleteApplication: (id) => api.delete(`/job-applications/${id}`),
  getApplicationStatistics: (params = {}) => api.get('/job-applications/statistics', { params }),

  // Alerts
  createJobAlert: (data) => api.post('/job-alerts', data),
  getUserJobAlerts: (userId, params = {}) => api.get(`/job-alerts/user/${userId}`, { params }),
  updateJobAlert: (id, data) => api.put(`/job-alerts/${id}`, data),
  toggleJobAlert: (id, isActive) => api.put(`/job-alerts/${id}/toggle`, { isActive }),
  deleteJobAlert: (id) => api.delete(`/job-alerts/${id}`),
  findMatchingJobs: (id, limit = 10) => api.get(`/job-alerts/${id}/matches`, { params: { limit } }),
  processAllAlerts: (frequency) => api.get('/job-alerts/process', { params: { frequency } }),
  getAlertStatistics: (params = {}) => api.get('/job-alerts/statistics', { params }),

  // Categories
  createJobCategory: (data) => api.post('/job-categories', data),
  getJobCategories: (params = {}) => api.get('/job-categories', { params }),
  getFeaturedCategories: (params = {}) => api.get('/job-categories/featured', { params }),
  getPopularCategories: (params = {}) => api.get('/job-categories/popular', { params }),
  getCategoriesByType: (type, params = {}) => api.get(`/job-categories/type/${type}`, { params }),
  updateJobCategory: (id, data) => api.put(`/job-categories/${id}`, data),
  deleteJobCategory: (id) => api.delete(`/job-categories/${id}`),

  // Trending skills
  upsertTrendingSkill: (skill, data) => api.post(`/trending-skills/${encodeURIComponent(skill)}`, data),
  getTrendingSkills: (params = {}) => api.get('/trending-skills', { params }),
  getSkillStatistics: () => api.get('/trending-skills/statistics'),
  getRisingSkills: (params = {}) => api.get('/trending-skills/rising', { params }),
  getHotSkills: (params = {}) => api.get('/trending-skills/hot', { params }),
  updateTrendingSkill: (id, data) => api.put(`/trending-skills/${id}`, data),
  deleteTrendingSkill: (id) => api.delete(`/trending-skills/${id}`),
  updateSkillTrends: () => api.put('/trending-skills/update-trends'),
};

export default jobMarketApi;
