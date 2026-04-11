export const chatPaths = {
  '/api/chat': {
    get: {
      tags: ['Chat'],
      summary: 'Get chat messages',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'query', name: 'userId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'List of messages' } }
    }
  },
  '/api/chat/send': {
    post: {
      tags: ['Chat'],
      summary: 'Send a message',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                receiverId: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      },
      responses: { 200: { description: 'Message sent' } }
    }
  }
};
