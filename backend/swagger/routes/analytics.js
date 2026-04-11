export const analyticsPaths = {
  '/api/analytics/dashboard': {
    get: {
      tags: ['Analytics'],
      summary: 'Get analytics dashboard data',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Dashboard analytics' } }
    }
  },
  '/api/analytics/user-skills': {
    get: {
      tags: ['Analytics'],
      summary: 'Get user skill analytics',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'User skill analytics' } }
    }
  },
  '/api/analytics/market-trends': {
    get: {
      tags: ['Analytics'],
      summary: 'Get market trends',
      responses: { 200: { description: 'Market trends data' } }
    }
  }
};
