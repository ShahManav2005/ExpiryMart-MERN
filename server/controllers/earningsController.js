const Inspection = require('../models/Inspection');
const Order = require('../models/Order');

const startOfDay = (date) => { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; };
const endOfDay = (date) => { const d = new Date(date); d.setHours(23, 59, 59, 999); return d; };

// @route GET /api/earnings/today
const getTodayEarnings = async (req, res) => {
  try {
    const from = startOfDay(new Date());
    const to = endOfDay(new Date());

    const inspectionVisits = await Inspection.find({
      agentId: req.user._id, sellerPaid: true, paidAt: { $gte: from, $lte: to },
    }).populate('productId', 'name');

    const deliveries = await Order.find({
      deliveryAgentId: req.user._id, deliveryStatus: 'delivered', deliveredAt: { $gte: from, $lte: to },
    });

    const inspectionTotal = inspectionVisits.reduce((sum, i) => sum + (i.visitEarning || 0), 0);
    const deliveryTotal = deliveries.reduce((sum, o) => sum + (o.deliveryEarning || 0), 0);

    res.json({
      date: new Date().toISOString().slice(0, 10),
      inspectionVisits,
      deliveries,
      inspectionTotal,
      deliveryTotal,
      grandTotal: inspectionTotal + deliveryTotal,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/earnings/summary
const getEarningsSummary = async (req, res) => {
  try {
    const inspectionVisits = await Inspection.find({ agentId: req.user._id, sellerPaid: true });
    const deliveries = await Order.find({ deliveryAgentId: req.user._id, deliveryStatus: 'delivered' });

    const inspectionTotal = inspectionVisits.reduce((sum, i) => sum + (i.visitEarning || 0), 0);
    const deliveryTotal = deliveries.reduce((sum, o) => sum + (o.deliveryEarning || 0), 0);

    res.json({
      totalVisits: inspectionVisits.length + deliveries.length,
      inspectionTotal,
      deliveryTotal,
      grandTotal: inspectionTotal + deliveryTotal,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/earnings/history
const getAllEarnings = async (req, res) => {
  try {
    const inspectionVisits = await Inspection.find({ agentId: req.user._id, sellerPaid: true })
      .populate('productId', 'name')
      .sort({ paidAt: -1 });

    const deliveries = await Order.find({ deliveryAgentId: req.user._id, deliveryStatus: 'delivered' })
      .sort({ deliveredAt: -1 });

    const entries = [
      ...inspectionVisits.map((v) => ({
        type: 'pickup',
        label: v.productId?.name || 'Product pickup',
        earning: v.visitEarning,
        distanceKm: v.distanceKm,
        date: v.paidAt,
      })),
      ...deliveries.map((d) => ({
        type: 'delivery',
        label: `Order #${d._id.toString().slice(-6)}`,
        earning: d.deliveryEarning,
        distanceKm: d.deliveryDistanceKm,
        date: d.deliveredAt,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const grandTotal = entries.reduce((sum, e) => sum + (e.earning || 0), 0);

    res.json({ entries, grandTotal, count: entries.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTodayEarnings, getEarningsSummary, getAllEarnings };

