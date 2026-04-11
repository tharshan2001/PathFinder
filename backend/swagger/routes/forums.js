export const forumPaths = {
  '/api/forums': {
    get: {
      tags: ['Forums'],
      summary: 'Get all forum topics',
      responses: { 200: { description: 'List of forum topics' } }
    },
    post: {
      tags: ['Forums'],
      summary: 'Create a forum topic',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                topic: { type: 'string' },
                content: { type: 'string' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Topic created' } }
    }
  },
  '/api/forums/{forumId}': {
    get: {
      tags: ['Forums'],
      summary: 'Get forum topic by ID',
      parameters: [{ in: 'path', name: 'forumId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Forum topic details' } }
    }
  },
  '/api/forums/{forumId}/posts': {
    post: {
      tags: ['Forums'],
      summary: 'Add a post to forum topic',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'forumId', required: true, schema: { type: 'string' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { content: { type: 'string' } } } } } },
      responses: { 201: { description: 'Post added' } }
    }
  }
};
