const Inspection = require('../models/Inspection');

// @route GET /api/inspections/pending
// @access agent only — returns all pending inspection requests with product + seller info
const getPendingInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find({ status: 'pending' })
      .populate('productId')
      .sort({ createdAt: 1 }); // oldest first — first-come-first-served queue

    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPendingInspections };