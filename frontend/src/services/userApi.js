import api from './api';

export const userApi = {
  // Get current user profile (POST method)
  getProfile: () => api.post('/users/get'),
  
  // Update profile
  updateProfile: (data) => api.put('/users/update', data),
  
  // Deactivate account
  deactivateAccount: () => api.put('/users/deactivate'),
  
  // Experience
  getExperience: () => api.get('/users/experience/all'),
  addExperience: (data) => api.post('/users/experience/add', data),
  updateExperience: (id, data) => api.put('/users/experience/update', { experienceId: id, ...data }),
  deleteExperience: (id) => api.delete(`/users/experience/delete?experienceId=${id}`),
  
  // Education
  getEducation: () => api.get('/users/education/all'),
  addEducation: (data) => api.post('/users/education/add', data),
  updateEducation: (id, data) => api.put('/users/education/update', { educationId: id, ...data }),
  deleteEducation: (id) => api.delete(`/users/education/delete?educationId=${id}`),
  
  // Projects
  getProjects: () => api.get('/users/project/all'),
  addProject: (data) => api.post('/users/project/add', data),
  updateProject: (id, data) => api.put('/users/project/update', { projectId: id, ...data }),
  deleteProject: (id) => api.delete(`/users/project/delete?projectId=${id}`),
  
  // Certifications
  getCertifications: () => api.get('/users/certification/all'),
  addCertification: (data) => api.post('/users/certification/add', data),
  updateCertification: (id, data) => api.put('/users/certification/update', { certificationId: id, ...data }),
  deleteCertification: (id) => api.delete(`/users/certification/delete?certificationId=${id}`),
  
  // Resume
  getResumes: () => api.get('/users/resume/all'),
  uploadResume: (formData) => api.post('/users/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteResume: (id) => api.delete(`/users/resume/delete?resumeId=${id}`),
  
  // Saved items
  getSavedCourses: () => api.get('/users/saved/courses'),
  getSavedJobs: () => api.get('/users/saved/jobs'),
  
  // Enrolled paths
  getEnrolledPaths: () => api.get('/users/enrolled/paths'),
  
  // Public profile (view other user)
  getPublicProfile: (userId) => api.get(`/users/public/${userId}`),

  // User suggestions (people you may know)
  getSuggestions: (limit = 10) => api.get(`/users/suggestions?limit=${limit}`),
};

export default userApi;
