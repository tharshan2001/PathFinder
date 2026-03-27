import api from './api';

export const connectionApi = {
  // Get all connections
  getConnections: () => api.get('/connections/connections'),
  
  // Get pending requests
  getPendingRequests: () => api.get('/connections/pending'),
  
  // Send connection request
  sendRequest: (recipientId, message = '') => api.post('/connections/request', { recipientId, message }),
  
  // Accept connection request
  acceptRequest: (connectionId) => api.post('/connections/accept', { connectionId }),
  
  // Reject connection request
  rejectRequest: (connectionId) => api.post('/connections/reject', { connectionId }),
  
  // Remove connection
  removeConnection: (connectionId) => api.post('/connections/remove', { connectionId }),
};

export default connectionApi;
