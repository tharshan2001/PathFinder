export const coursePaths = {
  '/api/courses': {
    get: {
      tags: ['Courses'],
      summary: 'Get all courses',
      parameters: [
        { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter by category' },
        { in: 'query', name: 'level', schema: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] }, description: 'Filter by difficulty level' },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number' },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Items per page' }
      ],
      responses: {
        200: {
          description: 'List of courses',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  courses: { type: 'array', items: { $ref: '#/components/schemas/Course' } },
                  pagination: {
                    type: 'object',
                    properties: {
                      currentPage: { type: 'integer' },
                      totalPages: { type: 'integer' },
                      totalCourses: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Courses'],
      summary: 'Create a new course',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'description', 'category'],
              properties: {
                title: { type: 'string', example: 'React Fundamentals' },
                description: { type: 'string', example: 'Learn React from scratch' },
                category: { type: 'string', example: 'Web Development' },
                provider: { type: 'string', example: 'SLIIT' },
                level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'beginner' },
                location: { type: 'string', example: 'Colombo, Sri Lanka' },
                duration: { type: 'string', example: '8 weeks' },
                price: { type: 'number', example: 0 }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Course created successfully' }, 400: { description: 'Bad request' } }
    }
  },
  '/api/courses/{id}': {
    get: {
      tags: ['Courses'],
      summary: 'Get course by ID',
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Course ID' }],
      responses: {
        200: { description: 'Course details', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, course: { $ref: '#/components/schemas/Course' } } } } } },
        404: { description: 'Course not found' }
      }
    },
    put: {
      tags: ['Courses'],
      summary: 'Update a course',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Course ID' }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, category: { type: 'string' }, provider: { type: 'string' }, level: { type: 'string' } } } } } },
      responses: { 200: { description: 'Course updated successfully' }, 404: { description: 'Course not found' } }
    },
    delete: {
      tags: ['Courses'],
      summary: 'Delete a course',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Course ID' }],
      responses: { 200: { description: 'Course deleted successfully' }, 404: { description: 'Course not found' } }
    }
  },
  '/api/courses/{courseId}/feedback': {
    get: {
      tags: ['Courses'],
      summary: 'Get feedback for a course',
      parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'string' }, description: 'Course ID' }],
      responses: { 200: { description: 'List of feedback' } }
    },
    post: {
      tags: ['Courses'],
      summary: 'Add feedback to a course',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'string' }, description: 'Course ID' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['rating'],
              properties: {
                rating: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                comment: { type: 'string', example: 'Great course!' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Feedback added successfully' } }
    }
  },
  '/api/courses/{courseId}/feedback/me': {
    get: {
      tags: ['Courses'],
      summary: "Get current user's feedback for a course",
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'string' }, description: 'Course ID' }],
      responses: { 200: { description: "User's feedback" } }
    }
  },
  '/api/courses/{courseId}/feedback/{feedbackId}': {
    put: {
      tags: ['Courses'],
      summary: 'Update feedback',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [
        { in: 'path', name: 'courseId', required: true, schema: { type: 'string' } },
        { in: 'path', name: 'feedbackId', required: true, schema: { type: 'string' } }
      ],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { rating: { type: 'number' }, comment: { type: 'string' } } } } } },
      responses: { 200: { description: 'Feedback updated' } }
    },
    delete: {
      tags: ['Courses'],
      summary: 'Delete feedback',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [
        { in: 'path', name: 'courseId', required: true, schema: { type: 'string' } },
        { in: 'path', name: 'feedbackId', required: true, schema: { type: 'string' } }
      ],
      responses: { 200: { description: 'Feedback deleted' } }
    }
  }
};
