const express = require('express');
const router = express.Router();
const { matchJobCandidates, matchStudentJobs } = require('../controllers/matchingController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { ROLES } = require('../config/constants');

router.use(auth);

router.post('/job-candidates', roleAuth(ROLES.EMPLOYER, ROLES.GOVERNMENT), matchJobCandidates);
router.post('/student-jobs', roleAuth(ROLES.STUDENT), matchStudentJobs);

module.exports = router;
