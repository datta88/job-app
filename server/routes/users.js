const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

// Admin routes for user management
router.get('/', auth, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin user management endpoint' });
});

module.exports = router; 