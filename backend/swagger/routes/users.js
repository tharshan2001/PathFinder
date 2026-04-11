export const userPaths = {
  '/api/users/get': {
    post: {
      tags: ['Users'],
      summary: 'Get current user profile',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'User profile data' }, 404: { description: 'User not found' } }
    }
  },
  '/api/users/update': {
    put: {
      tags: ['Users'],
      summary: 'Update current user profile',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                headline: { type: 'string' },
                bio: { type: 'string' },
                location: { type: 'string' },
                phone: { type: 'string' }
              }
            }
          }
        }
      },
      responses: { 200: { description: 'Profile updated' } }
    }
  },
  '/api/users/deactivate': {
    put: {
      tags: ['Users'],
      summary: 'Deactivate user account',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'Account deactivated' } }
    }
  },
  '/api/users/public/{userId}': {
    get: {
      tags: ['Users'],
      summary: 'Get public profile by user ID',
      parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Public profile data' } }
    }
  },
  '/api/users/skill/all': {
    get: {
      tags: ['Users'],
      summary: 'Get all user skills',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of skills' } }
    }
  },
  '/api/users/skill/add': {
    post: {
      tags: ['Users'],
      summary: 'Add a skill',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                proficiencyLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
              }
            }
          }
        }
      },
      responses: { 200: { description: 'Skill added' } }
    }
  },
  '/api/users/skill/delete': {
    delete: {
      tags: ['Users'],
      summary: 'Delete a skill',
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } } } } },
      responses: { 200: { description: 'Skill deleted' } }
    }
  },
  '/api/users/resume/upload': {
    post: {
      tags: ['Users'],
      summary: 'Upload resume',
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { resume: { type: 'string', format: 'binary' } } } } } },
      responses: { 200: { description: 'Resume uploaded' } }
    }
  },
  '/api/users/resume/all': {
    get: {
      tags: ['Users'],
      summary: 'Get all resumes',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of resumes' } }
    }
  },
  '/api/users/resume/delete': {
    delete: {
      tags: ['Users'],
      summary: 'Delete a resume',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'query', name: 'resumeId', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Resume deleted' } }
    }
  },
  '/api/users/saved/courses': {
    get: {
      tags: ['Users'],
      summary: 'Get saved courses',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of saved courses' } }
    }
  },
  '/api/users/saved/jobs': {
    get: {
      tags: ['Users'],
      summary: 'Get saved jobs',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of saved jobs' } }
    }
  },
  '/api/users/suggestions': {
    get: {
      tags: ['Users'],
      summary: 'Get user suggestions',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Suggested users' } }
    }
  },
  '/api/users/experience/all': {
    get: {
      tags: ['Users'],
      summary: 'Get all experience entries',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of experience' } }
    }
  },
  '/api/users/experience/add': {
    post: {
      tags: ['Users'],
      summary: 'Add experience',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Experience added' } }
    }
  },
  '/api/users/education/all': {
    get: {
      tags: ['Users'],
      summary: 'Get all education entries',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of education' } }
    }
  },
  '/api/users/education/add': {
    post: {
      tags: ['Users'],
      summary: 'Add education',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Education added' } }
    }
  },
  '/api/users/project/all': {
    get: {
      tags: ['Users'],
      summary: 'Get all projects',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of projects' } }
    }
  },
  '/api/users/certification/all': {
    get: {
      tags: ['Users'],
      summary: 'Get all certifications',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'List of certifications' } }
    }
  }
};
