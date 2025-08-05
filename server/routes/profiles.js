const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  getPublicProfile
} = require('../controllers/profileController');

// Protected routes - allow both jobseeker and employer
// Specific routes first
router.get('/me', auth, getProfile);
router.post('/', auth, uploadResume, updateProfile); // POST for creating/updating
router.put('/me', auth, uploadResume, updateProfile); // PUT for updating

// Parameterized routes last
router.get('/:userId', getPublicProfile);

module.exports = router; 