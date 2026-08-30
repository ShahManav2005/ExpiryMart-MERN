const express = require('express');
const router = express.Router();
const {
  getPendingInspections,
  decideInspection,
  getAwaitingPickup,
  updateLogistics,
  getInspectionHistory,
} = require('../controllers/inspectionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/pending', protect, authorize('agent'), getPendingInspections);
router.get('/awaiting-pickup', protect, authorize('agent'), getAwaitingPickup);
router.get('/history', protect, authorize('agent'), getInspectionHistory);
router.put('/:id/decision', protect, authorize('agent'), decideInspection);
router.put('/:id/logistics', protect, authorize('agent'), updateLogistics);

module.exports = router;