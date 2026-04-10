import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5080';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.onlineUsers = new Set();
  }

  connect(userId) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      if (userId) {
        this.socket.emit('joinRoom', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('newMessage', (data) => {
      console.log('New message received:', data);
      const callback = this.listeners.get('newMessage');
      if (callback) callback(data);
    });

    this.socket.on('userOnline', (data) => {
      this.onlineUsers.add(data.userId);
      const callback = this.listeners.get('userOnline');
      if (callback) callback(data);
    });

    this.socket.on('userOffline', (data) => {
      this.onlineUsers.delete(data.userId);
      const callback = this.listeners.get('userOffline');
      if (callback) callback(data);
    });

    this.socket.on('onlineUsers', (userIds) => {
      this.onlineUsers = new Set(userIds);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    this.listeners.set(event, callback);
  }

  off(event) {
    this.listeners.delete(event);
  }

  isOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  joinRoom(userId) {
    if (this.socket?.connected) {
      this.socket.emit('joinRoom', userId);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
