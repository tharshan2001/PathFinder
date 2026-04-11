export const recommendationPaths = {
  '/api/recommendations/jobs': {
    get: {
      tags: ['Recommendations'],
      summary: 'Get personalized job recommendations',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'List of recommended jobs' } }
    }
  },
  '/api/course-recommendations': {
    get: {
      tags: ['Recommendations'],
      summary: 'Get personalized course recommendations',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: { 200: { description: 'List of recommended courses' } }
    }
  }
};
