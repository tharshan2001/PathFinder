import api from './api';

export const getMySkillProfile = async () => {
  const response = await api.get('/skill-profile');
  return response.data;
};

export const addSkillToProfile = async (skill) => {
  const response = await api.post('/skill-profile/skill', {
    skills: [skill],
  });
  return response.data;
};

export const deleteSkillFromProfile = async (skillName) => {
  const response = await api.delete(`/skill-profile/skill/${encodeURIComponent(skillName)}`);
  return response.data;
};

export const updateSkillInProfile = async (skillName, level) => {
  const response = await api.put(`/skill-profile/skill/${encodeURIComponent(skillName)}`, {
    level,
  });
  return response.data;
};

export const getRecommendedJobs = async () => {
  const response = await api.get('/recommendations/jobs');
  return response.data;
};

export const getSkillGapAnalysis = async () => {
  const response = await api.get('/analytics/skill-gap');
  return response.data;
};

export const getRecommendedCourses = async () => {
  const response = await api.get('/course-recommendations/recommended-courses');
  return response.data;
};

