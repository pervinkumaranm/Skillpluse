const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, getSkills, updateSkills,
  getSkillGap, getRecommendedJobs, getRecommendedTrainings,
  uploadResume, deleteResume,
} = require('../controllers/studentController');
const { updateProfileValidator, updateSkillsValidator } = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/constants');

router.use(auth, roleAuth(ROLES.STUDENT));

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, validate, updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.delete('/resume', deleteResume);
router.get('/skills', getSkills);
router.put('/skills', updateSkillsValidator, validate, updateSkills);
router.get('/skill-gap', getSkillGap);
router.get('/recommended-jobs', getRecommendedJobs);
router.get('/recommended-trainings', getRecommendedTrainings);

module.exports = router;
