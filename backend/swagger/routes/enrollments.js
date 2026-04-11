export const enrollmentPaths = {
  '/api/enrollments': {
    get: {
      tags: ['Enrollments'],
      summary: 'Get user enrollments',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of enrollments' } }
    }
  },
  '/api/enrollments/{courseId}': {
    post: {
      tags: ['Enrollments'],
      summary: 'Enroll in a course',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Enrolled successfully' } }
    },
    delete: {
      tags: ['Enrollments'],
      summary: 'Unenroll from a course',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Unenrolled successfully' } }
    }
  },
  '/api/enrollments/{courseId}/progress': {
    put: {
      tags: ['Enrollments'],
      summary: 'Update course progress',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'string' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { progress: { type: 'number' } } } } } },
      responses: { 200: { description: 'Progress updated' } }
    }
  }
};
