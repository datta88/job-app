const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

// Protected routes - specific routes first
router.get('/my', auth, authorize('jobseeker'), getMyApplications);
router.post('/jobs/:jobId/apply', auth, authorize('jobseeker'), uploadResume, applyForJob);

// Parameterized routes last
router.get('/jobs/:jobId', auth, authorize('employer', 'admin'), getJobApplications);
router.put('/:id/status', auth, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router; 