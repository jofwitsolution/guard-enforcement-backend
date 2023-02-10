const express = require('express');
const { signupUser } = require('../controllers/userController');

const router = express.Router();

/* Register user*/
router.post('/signup', signupUser);

module.exports = router;
