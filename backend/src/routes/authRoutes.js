const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;
