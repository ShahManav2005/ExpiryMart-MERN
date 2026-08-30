const Inspection = require('../models/Inspection');
const { calculateRecommendedBuyingPrice, calculateSellingPrice, calculateAgentCommission } = require('../utils/pricingEngine');
const { validateProductForApproval } = require('../utils/inspectionRules');

const sellerPopulate = {
  path: 'productId',
  populate: { path: 'sellerId', select: 'name phone address shopName' },
};

// @route GET /api/inspections/pending
const getPendingInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find({ status: 'pending' })
      .populate(sellerPopulate)
      .sort({ createdAt: 1 });

    const withRecommendation = inspections.map((inspection) => {
      const rec = calculateRecommendedBuyingPrice(inspection.productId);
      return { ...inspection.toObject(), recommendation: rec };
    });

    res.json(withRecommendation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/inspections/:id/decision
const decideInspection = async (req, res) => {
  try {
    const { decision, notes, buyingPrice } = req.body;

    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ message: 'Decision must be "approve" or "reject"' });
    }

    const inspection = await Inspection.findById(req.params.id).populate('productId');

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    if (inspection.status !== 'pending') {
      return res.status(400).json({ message: 'This inspection has already been decided' });
    }

    const product = inspection.productId;

    if (decision === 'approve') {
      const { valid, errors } = validateProductForApproval(product);
      if (!valid) {
        return res.status(400).json({ message: 'Approval blocked by rules', errors });
      }

      const recommendation = calculateRecommendedBuyingPrice(product);
      const finalBuyingPrice = buyingPrice ?? recommendation.buyingPrice;

      const { markupPercent, sellingPrice } = calculateSellingPrice(finalBuyingPrice, product.expiryDate);
      const agentCommission = calculateAgentCommission(sellingPrice);

      product.buyingPrice = finalBuyingPrice;
      product.sellingPrice = sellingPrice;
      product.status = 'listed';

      inspection.status = 'approved';
      inspection.buyingPricePercent = recommendation.percent;
      inspection.markupPercent = markupPercent;
      inspection.agentCommission = agentCommission;
      inspection.feeRefunded = true;
    } else {
      inspection.status = 'rejected';
      inspection.feeRefunded = false;
      product.status = 'rejected';
    }

    inspection.agentId = req.user._id;
    inspection.notes = notes || '';
    inspection.inspectedAt = new Date();

    await inspection.save();
    await product.save();

    res.json({ inspection, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/inspections/awaiting-pickup
const getAwaitingPickup = async (req, res) => {
  try {
    const inspections = await Inspection.find({
      status: 'approved',
      sellerPaid: false,
      agentId: req.user._id,
    })
      .populate(sellerPopulate)
      .sort({ inspectedAt: 1 });

    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/inspections/:id/logistics
const updateLogistics = async (req, res) => {
  try {
    const { pickupDate, sellerPaid } = req.body;

    const inspection = await Inspection.findById(req.params.id);

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    if (inspection.agentId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this inspection' });
    }

    if (pickupDate !== undefined) inspection.pickupDate = pickupDate;
    if (sellerPaid !== undefined) inspection.sellerPaid = sellerPaid;

    await inspection.save();
    res.json(inspection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/inspections/history
const getInspectionHistory = async (req, res) => {
  try {
    const inspections = await Inspection.find({
      agentId: req.user._id,
      $or: [{ status: 'rejected' }, { status: 'approved', sellerPaid: true }],
    })
      .populate(sellerPopulate)
      .sort({ inspectedAt: -1 });

    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPendingInspections,
  decideInspection,
  getAwaitingPickup,
  updateLogistics,
  getInspectionHistory,
};