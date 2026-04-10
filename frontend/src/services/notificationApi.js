import api from './api';

export const notificationApi = {
  getNotifications: (page = 1, limit = 20, unreadOnly = false) => 
    api.get(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`),
  
  getUnreadCount: () => api.get('/notifications/unread-count'),
  
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default notificationApi;