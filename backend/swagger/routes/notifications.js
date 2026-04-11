export const notificationPaths = {
  '/api/notifications': {
    get: {
      tags: ['Notifications'],
      summary: 'Get all notifications',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'List of notifications' } }
    }
  },
  '/api/notifications/unread-count': {
    get: {
      tags: ['Notifications'],
      summary: 'Get unread notification count',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'Unread count' } }
    }
  },
  '/api/notifications/read-all': {
    put: {
      tags: ['Notifications'],
      summary: 'Mark all notifications as read',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'All notifications marked as read' } }
    }
  },
  '/api/notifications/{notificationId}/read': {
    put: {
      tags: ['Notifications'],
      summary: 'Mark notification as read',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'notificationId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Notification marked as read' } }
    }
  },
  '/api/notifications/{notificationId}': {
    delete: {
      tags: ['Notifications'],
      summary: 'Delete notification',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'notificationId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Notification deleted' } }
    }
  }
};
