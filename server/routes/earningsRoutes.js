const express = require('express');
const router = express.Router();
const { getTodayEarnings, getEarningsSummary } = require('../controllers/earningsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/today', protect, authorize('agent'), getTodayEarnings);
router.get('/summary', protect, authorize('agent'), getEarningsSummary);

module.exports = router;