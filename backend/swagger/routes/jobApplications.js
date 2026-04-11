export const jobApplicationPaths = {
  '/api/job-applications': {
    get: {
      tags: ['Job Applications'],
      summary: 'Get job applications',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'query', name: 'userId', schema: { type: 'string' } }],
      responses: { 200: { description: 'List of applications' } }
    },
    post: {
      tags: ['Job Applications'],
      summary: 'Submit job application',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                jobId: { type: 'string' },
                resumeId: { type: 'string' },
                coverLetter: { type: 'string' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Application submitted' } }
    }
  },
  '/api/job-applications/{applicationId}': {
    put: {
      tags: ['Job Applications'],
      summary: 'Update application status',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'applicationId', required: true, schema: { type: 'string' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['pending', 'reviewed', 'interview', 'rejected', 'accepted'] } } } } } },
      responses: { 200: { description: 'Application updated' } }
    },
    delete: {
      tags: ['Job Applications'],
      summary: 'Withdraw application',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'applicationId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Application withdrawn' } }
    }
  }
};
