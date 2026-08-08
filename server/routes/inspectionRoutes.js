const express = require('express');
const router = express.Router();
const { getPendingInspections } = require('../controllers/inspectionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/pending', protect, authorize('agent'), getPendingInspections);

module.exports = router;