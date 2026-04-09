import api from "./api";

export const getCourses = async (params = {}) => {
  const response = await api.get("/courses", { params });
  return response.data;
};

export const getCourseFeedback = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/feedback`);
  return response.data;
};

export const createFeedback = async (courseId, payload) => {
  const response = await api.post(`/courses/${courseId}/feedback`, payload);
  return response.data;
};

export const updateFeedback = async (courseId, feedbackId, payload) => {
  const response = await api.put(`/courses/${courseId}/feedback/${feedbackId}`, payload);
  return response.data;
};

export const deleteFeedback = async (courseId, feedbackId) => {
  const response = await api.delete(`/courses/${courseId}/feedback/${feedbackId}`);
  return response.data;
};

export const enrollInCourse = async (courseId, userId) => {
  const response = await api.post(`/enrollments/enroll/${courseId}`, { userId });
  return response.data;
};

export const getMyEnrollments = async (userId) => {
  const response = await api.get(`/enrollments/user/${userId}`);
  return response.data;
};

export const updateEnrollmentProgress = async (enrollmentId, progress) => {
  const response = await api.put(`/enrollments/progress/${enrollmentId}`, { progress });
  return response.data;
};
