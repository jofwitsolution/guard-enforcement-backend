const express = require('express');
const {
  signupUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/* Register user*/
router.post('/signup', signupUser);
router.get('/:id/profile', protect, getUserProfile);
router.patch('/:id/profile', protect, updateUserProfile);

module.exports = router;
