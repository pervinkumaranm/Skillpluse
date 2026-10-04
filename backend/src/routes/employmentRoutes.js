const express = require('express');
const router = express.Router();
const { reportEmployment, uploadProof, verifyEmployment, getEmployment } = require('../controllers/employmentController');
const { createEmploymentValidator } = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/constants');

router.use(auth);

router.get('/', getEmployment);
router.post('/', roleAuth(ROLES.STUDENT), createEmploymentValidator, validate, reportEmployment);
router.put('/:id/upload-proof', roleAuth(ROLES.STUDENT), upload.single('proofDocument'), uploadProof);
router.put('/:id/verify', roleAuth(ROLES.EMPLOYER, ROLES.GOVERNMENT), verifyEmployment);

module.exports = router;
