import api from './api';

export const authService = {
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const studentService = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  uploadResume: (formData) => api.post('/students/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteResume: () => api.delete('/students/resume'),
  getSkills: () => api.get('/students/skills'),
  updateSkills: (skills) => api.put('/students/skills', { skills }),
  getSkillGap: () => api.get('/students/skill-gap'),
  getRecommendedJobs: () => api.get('/students/recommended-jobs'),
  getRecommendedTrainings: () => api.get('/students/recommended-trainings'),
};

export const trainingService = {
  getPrograms: (params) => api.get('/trainings', { params }),
  getProgram: (id) => api.get(`/trainings/${id}`),
  createProgram: (data) => api.post('/trainings', data),
  updateProgram: (id, data) => api.put(`/trainings/${id}`, data),
  deleteProgram: (id) => api.delete(`/trainings/${id}`),
  enrollStudent: (id) => api.post(`/trainings/${id}/enroll`),
  getEnrolledStudents: (id) => api.get(`/trainings/${id}/students`),
  updateEnrollment: (id, data) => api.put(`/trainings/enrollment/${id}`, data),
  recordAssessment: (data) => api.post('/trainings/assessment', data),
  issueCertificate: (data) => api.post('/trainings/certificate', data),
  getDashboard: () => api.get('/trainings/dashboard'),
  verifyCertificate: (certId) => api.get(`/trainings/certificate/verify/${certId}`),
};

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  applyForJob: (id, data) => api.post(`/jobs/${id}/apply`, data),
  getJobApplications: (id) => api.get(`/jobs/${id}/applications`),
  getEmployerApplications: () => api.get('/jobs/employer/all-applications'),
  updateApplicationStatus: (id, data) => api.put(`/jobs/application/${id}`, data),
  getMyApplications: () => api.get('/jobs/my-applications'),
  getMyJobs: () => api.get('/jobs/my-jobs'),
};

export const matchingService = {
  matchJobCandidates: (data) => api.post('/matching/job-candidates', data),
  matchStudentJobs: (data) => api.post('/matching/student-jobs', data),
};

export const employmentService = {
  reportEmployment: (data) => api.post('/employment', data),
  uploadProof: (id, formData) => api.put(`/employment/${id}/upload-proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  verifyEmployment: (id, data) => api.put(`/employment/${id}/verify`, data),
  getEmployment: (params) => api.get('/employment', { params }),
};

export const governmentService = {
  getOverview: () => api.get('/government/overview'),
  getDistrictAnalytics: () => api.get('/government/districts'),
  getSkillAnalytics: () => api.get('/government/skills'),
  getTrainingEffectiveness: () => api.get('/government/training-effectiveness'),
  getEmploymentAnalytics: () => api.get('/government/employment'),
  exportReport: (type) => api.get(`/government/export/${type}`, { responseType: 'blob' }),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};
