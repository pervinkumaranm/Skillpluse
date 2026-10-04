const express = require('express');
const router = express.Router();
const {
  getJobs, getJob, createJob, updateJob, deleteJob,
  applyForJob, getJobApplications, updateApplicationStatus,
  getMyApplications, getMyJobs, getEmployerApplications,
} = require('../controllers/jobController');
const { createJobValidator } = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { ROLES } = require('../config/constants');

// Protected routes
router.use(auth);

// Student routes
router.get('/my-applications', roleAuth(ROLES.STUDENT), getMyApplications);

// Employer routes
router.get('/my-jobs', roleAuth(ROLES.EMPLOYER), getMyJobs);
router.get('/employer/all-applications', roleAuth(ROLES.EMPLOYER), getEmployerApplications);

// General
router.get('/', getJobs);
router.get('/:id', getJob);

// Employer only
router.post('/', roleAuth(ROLES.EMPLOYER), createJobValidator, validate, createJob);
router.put('/:id', roleAuth(ROLES.EMPLOYER), updateJob);
router.delete('/:id', roleAuth(ROLES.EMPLOYER), deleteJob);

// Student apply
router.post('/:id/apply', roleAuth(ROLES.STUDENT), applyForJob);

// Employer view applications
router.get('/:id/applications', roleAuth(ROLES.EMPLOYER), getJobApplications);

// Employer update application status
router.put('/application/:id', roleAuth(ROLES.EMPLOYER), updateApplicationStatus);

module.exports = router;
