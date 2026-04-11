import { authPaths } from './auth.js';
import { coursePaths } from './courses.js';
import { jobPaths } from './jobs.js';
import { userPaths } from './users.js';
import { connectionPaths } from './connections.js';
import { notificationPaths } from './notifications.js';
import { recommendationPaths } from './recommendations.js';
import { enrollmentPaths } from './enrollments.js';
import { trendingSkillsPaths } from './trendingSkills.js';
import { chatPaths } from './chat.js';
import { forumPaths } from './forums.js';
import { analyticsPaths } from './analytics.js';
import { learningPathPaths } from './learningPaths.js';
import { jobApplicationPaths } from './jobApplications.js';

export const paths = {
  ...authPaths,
  ...coursePaths,
  ...jobPaths,
  ...userPaths,
  ...connectionPaths,
  ...notificationPaths,
  ...recommendationPaths,
  ...enrollmentPaths,
  ...trendingSkillsPaths,
  ...chatPaths,
  ...forumPaths,
  ...analyticsPaths,
  ...learningPathPaths,
  ...jobApplicationPaths
};
