const Inspection = require('../models/Inspection');
const {validateProductForApproval } = require('../utils/inspectionRules')
const { calculateRecommendedBuyingPrice , calculateSellingPrice, calculateAgentCommission } = require('../utils/pricingEngine');
// const { validateProductForApproval } = require('../utils/inspectionRules');


// @route GET /api/inspections/pending
// @access agent only — returns all pending inspection requests with product + seller info
const getPendingInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find({ status: 'pending' })
      .populate('productId')
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

// @routes PUT api/inspections/:id/decision
// @access agent only

const decideInspection = async (req, res) => {
  try {
    const { decision, notes, buyingPrice } = req.body; // buyingPrice optional — agent can override recommendation

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
      const finalBuyingPrice = buyingPrice ?? recommendation.buyingPrice; // agent's override or the recommendation

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
      inspection.feeRefunded = false; // simplification: any rejection is treated as non-refundable per your doc's default
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

module.exports = { getPendingInspections , decideInspection };