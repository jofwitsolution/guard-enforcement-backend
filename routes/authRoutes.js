const { loginUser } = require('../controllers/authController');
const express = require('express');
const router = express.Router();

// email and password authentication
router.post('/login', loginUser);

module.exports = router;
