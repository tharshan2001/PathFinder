export const learningPathPaths = {
  '/api/learning-paths': {
    get: {
      tags: ['Learning Paths'],
      summary: 'Get all learning paths',
      responses: { 200: { description: 'List of learning paths' } }
    },
    post: {
      tags: ['Learning Paths'],
      summary: 'Create a learning path',
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
      responses: { 201: { description: 'Learning path created' } }
    }
  },
  '/api/learning-paths/{pathId}': {
    get: {
      tags: ['Learning Paths'],
      summary: 'Get learning path by ID',
      parameters: [{ in: 'path', name: 'pathId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Learning path details' } }
    }
  },
  '/api/learning-paths/user/{userId}': {
    get: {
      tags: ['Learning Paths'],
      summary: 'Get learning paths for user',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'User learning paths' } }
    }
  }
};
