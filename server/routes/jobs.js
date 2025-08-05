const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
} = require('../controllers/jobController');

// Public routes
router.get('/', getJobs);

// Protected routes - specific routes first
router.get('/my/jobs', auth, authorize('employer', 'admin'), getMyJobs);

// Parameterized routes last
router.get('/:id', getJob);
router.post('/', auth, authorize('employer', 'admin'), createJob);
router.put('/:id', auth, authorize('employer', 'admin'), updateJob);
router.delete('/:id', auth, authorize('employer', 'admin'), deleteJob);

module.exports = router; 