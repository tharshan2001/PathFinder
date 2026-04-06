import api from './api';

export const forumApi = {
  getForums: (category) => api.get('/forums', { params: { category } }),
  getForumById: (id) => api.get(`/forums/${id}`),
  createForum: (data) => api.post('/forums', data),
  updateForum: (id, data) => api.put(`/forums/${id}`, data),
  deleteForum: (id) => api.delete(`/forums/${id}`),
  addReply: (id, content) => api.post(`/forums/${id}/reply`, { content }),
  voteForum: (id, vote) => api.post(`/forums/${id}/vote`, { vote }),
  getCategories: () => api.get('/forums/categories'),
};

export default forumApi;
