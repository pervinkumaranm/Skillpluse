const express = require('express');
const router = express.Router();
const {
  getPrograms, getProgram, createProgram, updateProgram, deleteProgram,
  enrollStudent, getEnrolledStudents, updateEnrollment,
  recordAssessment, issueCertificate, getDashboard, verifyCertificate,
} = require('../controllers/trainingController');
const { createTrainingValidator, assessmentValidator } = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { ROLES } = require('../config/constants');

// Public route for certificate verification
router.get('/certificate/verify/:certificateId', verifyCertificate);

// Public route for browsing (students)
router.get('/', auth, getPrograms);
router.get('/dashboard', auth, roleAuth(ROLES.TRAINING_CENTRE), getDashboard);

// Training centre management
router.post('/', auth, roleAuth(ROLES.TRAINING_CENTRE), createTrainingValidator, validate, createProgram);

router.get('/:id', auth, getProgram);
router.put('/:id', auth, roleAuth(ROLES.TRAINING_CENTRE), updateProgram);
router.delete('/:id', auth, roleAuth(ROLES.TRAINING_CENTRE), deleteProgram);

// Enrollment
router.post('/:id/enroll', auth, roleAuth(ROLES.STUDENT), enrollStudent);
router.get('/:id/students', auth, roleAuth(ROLES.TRAINING_CENTRE), getEnrolledStudents);

// Enrollment management
router.put('/enrollment/:id', auth, roleAuth(ROLES.TRAINING_CENTRE), updateEnrollment);

// Assessment
router.post('/assessment', auth, roleAuth(ROLES.TRAINING_CENTRE), assessmentValidator, validate, recordAssessment);

// Certificate
router.post('/certificate', auth, roleAuth(ROLES.TRAINING_CENTRE), issueCertificate);

module.exports = router;
