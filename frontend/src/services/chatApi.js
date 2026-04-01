import api from './api';

export const chatApi = {
  // Create or get a chat with a user
  createOrGetChat: (receiverId) => api.post('/chat/chats', { receiverId }),
  
  // Send a message
  sendMessage: (chatId, text) => api.post('/chat/messages', { chatId, text }),
  
  // Get inbox (all chats for current user - pass user ID)
  getInbox: (userId) => api.get(`/chat/chats/${userId}`),
  
  // Get messages for a specific chat
  getMessages: (chatId) => api.get(`/chat/messages/${chatId}`),
};

export default chatApi;
