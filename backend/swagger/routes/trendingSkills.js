export const trendingSkillsPaths = {
  '/api/trending-skills': {
    get: {
      tags: ['Trending Skills'],
      summary: 'Get trending skills',
      responses: { 200: { description: 'List of trending skills' } }
    }
  },
  '/api/trending-skills/{skillName}': {
    get: {
      tags: ['Trending Skills'],
      summary: 'Get trending skill details',
      parameters: [{ in: 'path', name: 'skillName', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Skill details' } }
    }
  }
};
