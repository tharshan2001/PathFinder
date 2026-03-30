import api from './api';

export const connectionApi = {
  getConnections: () => api.get('/connections/connections'),
  getPendingRequests: () => api.get('/connections/pending'),
  sendRequest: (recipientId, message = '') => api.post('/connections/request', { recipientId, message }),
  acceptRequest: (connectionId) => api.post('/connections/accept', { connectionId }),
  rejectRequest: (connectionId) => api.post('/connections/reject', { connectionId }),
  removeConnection: (connectionId) => api.post('/connections/remove', { connectionId }),
  getSuggestions: (limit = 10) => api.get(`/users/suggestions?limit=${limit}`),
};

export default connectionApi;
