const express = require('express');
const router = express.Router();
const { getPendingInspections , decideInspection } = require('../controllers/inspectionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/pending', protect, authorize('agent'), getPendingInspections);
router.put('/:id/decision' , protect , authorize('agent') , decideInspection)

module.exports = router;