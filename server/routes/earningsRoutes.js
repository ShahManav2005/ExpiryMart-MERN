const express = require('express');
const router = express.Router();
const { getTodayEarnings, getEarningsSummary , getAllEarnings } = require('../controllers/earningsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/today', protect, authorize('agent'), getTodayEarnings);
router.get('/summary', protect, authorize('agent'), getEarningsSummary);
router.get('/history', protect, authorize('agent'), getAllEarnings);

module.exports = router;