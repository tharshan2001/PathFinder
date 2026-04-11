export const connectionPaths = {
  '/api/connections/request': {
    post: {
      tags: ['Connections'],
      summary: 'Send connection request',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { targetUserId: { type: 'string' } } } } } },
      responses: { 200: { description: 'Request sent' } }
    }
  },
  '/api/connections/accept': {
    post: {
      tags: ['Connections'],
      summary: 'Accept connection request',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { requestId: { type: 'string' } } } } } },
      responses: { 200: { description: 'Connection accepted' } }
    }
  },
  '/api/connections/reject': {
    post: {
      tags: ['Connections'],
      summary: 'Reject connection request',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { requestId: { type: 'string' } } } } } },
      responses: { 200: { description: 'Request rejected' } }
    }
  },
  '/api/connections/remove': {
    post: {
      tags: ['Connections'],
      summary: 'Remove connection',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { connectionId: { type: 'string' } } } } } },
      responses: { 200: { description: 'Connection removed' } }
    }
  },
  '/api/connections/connections': {
    get: {
      tags: ['Connections'],
      summary: 'Get user connections',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'List of connections' } }
    }
  },
  '/api/connections/pending': {
    get: {
      tags: ['Connections'],
      summary: 'Get pending connection requests',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'List of pending requests' } }
    }
  }
};
