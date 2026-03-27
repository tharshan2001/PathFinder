import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5080';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
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

  joinRoom(userId) {
    if (this.socket?.connected) {
      this.socket.emit('joinRoom', userId);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
