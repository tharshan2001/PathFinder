export const jobPaths = {
  '/api/jobs': {
    get: {
      tags: ['Jobs'],
      summary: 'Get all jobs',
      parameters: [
        { in: 'query', name: 'category', schema: { type: 'string' } },
        { in: 'query', name: 'location', schema: { type: 'string' } },
        { in: 'query', name: 'employmentType', schema: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship'] } },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
      ],
      responses: {
        200: {
          description: 'List of jobs',
          content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, jobs: { type: 'array', items: { $ref: '#/components/schemas/Job' } } } } } }
        }
      }
    },
    post: {
      tags: ['Jobs'],
      summary: 'Create a new job (admin only)',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'company', 'description'],
              properties: {
                title: { type: 'string', example: 'Software Engineer' },
                company: { type: 'string', example: 'Tech Corp' },
                location: { type: 'string', example: 'Colombo, Sri Lanka' },
                employmentType: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship'] },
                salaryRange: { type: 'object', properties: { min: { type: 'number' }, max: { type: 'number' } } },
                skillsRequired: { type: 'array', items: { type: 'string' } },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Job created' }, 403: { description: 'Forbidden' } }
    }
  },
  '/api/jobs/featured': {
    get: {
      tags: ['Jobs'],
      summary: 'Get featured jobs',
      responses: { 200: { description: 'Featured jobs list' } }
    }
  },
  '/api/jobs/recent': {
    get: {
      tags: ['Jobs'],
      summary: 'Get recent jobs',
      parameters: [{ in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }],
      responses: { 200: { description: 'Recent jobs list' } }
    }
  },
  '/api/jobs/statistics': {
    get: {
      tags: ['Jobs'],
      summary: 'Get job statistics',
      responses: { 200: { description: 'Job statistics data' } }
    }
  },
  '/api/jobs/search': {
    get: {
      tags: ['Jobs'],
      summary: 'Search jobs',
      parameters: [
        { in: 'query', name: 'q', schema: { type: 'string' }, description: 'Search query' },
        { in: 'query', name: 'skills', schema: { type: 'string' }, description: 'Comma-separated skills' }
      ],
      responses: { 200: { description: 'Search results' } }
    }
  },
  '/api/jobs/{id}': {
    get: {
      tags: ['Jobs'],
      summary: 'Get job by ID',
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Job details' }, 404: { description: 'Job not found' } }
    },
    put: {
      tags: ['Jobs'],
      summary: 'Update a job (admin only)',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
      responses: { 200: { description: 'Job updated' }, 404: { description: 'Job not found' } }
    },
    delete: {
      tags: ['Jobs'],
      summary: 'Delete a job (admin only)',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Job deleted' }, 404: { description: 'Job not found' } }
    }
  }
};
