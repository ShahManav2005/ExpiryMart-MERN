const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getDeliveryQueue, completeDelivery } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('buyer'), createOrder);
router.get('/mine', protect, authorize('buyer'), getMyOrders);
router.get('/delivery-queue', protect, authorize('agent'), getDeliveryQueue);
router.put('/:id/deliver', protect, authorize('agent'), completeDelivery);

module.exports = router;