const express = require('express');
const router = express.Router();
const {
  getOverview, getDistrictAnalytics, getSkillAnalytics,
  getTrainingEffectiveness, getEmploymentAnalytics, exportReport,
} = require('../controllers/governmentController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { ROLES } = require('../config/constants');

router.use(auth, roleAuth(ROLES.GOVERNMENT));

router.get('/overview', getOverview);
router.get('/districts', getDistrictAnalytics);
router.get('/skills', getSkillAnalytics);
router.get('/training-effectiveness', getTrainingEffectiveness);
router.get('/employment', getEmploymentAnalytics);
router.get('/export/:type', exportReport);

module.exports = router;
