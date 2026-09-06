// console.log('FILE RELOADED - TEST');
const Inspection = require('../models/Inspection');
const Product = require('../models/Product');
const { calculateRecommendedBuyingPrice, calculateSellingPrice, calculateAgentCommission, calculateDeliveryEarning , calculateDistanceCharge, AGENT_FLAT_PAY } = require('../utils/pricingEngine');
const { validateProductForApproval } = require('../utils/inspectionRules');

const sellerPopulate = {
  path: 'productId',
  populate: { path: 'sellerId', select: 'name phone address shopName' },
};

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
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};

const decideInspection = async (req, res) => {
  try {
    const { decision, notes, buyingPrice } = req.body;

    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ message: 'Decision must be "approve" or "reject"' });
    }

    const inspection = await Inspection.findById(req.params.id).populate('productId');
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    if (inspection.status !== 'pending') {
      return res.status(400).json({ message: 'This inspection has already been decided' });
    }

    const product = inspection.productId;

    if (decision === 'approve') {
      const { valid, errors } = validateProductForApproval(product);
      if (!valid) return res.status(400).json({ message: 'Approval blocked by rules', errors });

      const recommendation = calculateRecommendedBuyingPrice(product);

      const numericBuyingPrice = Number(buyingPrice);
      const finalTotalBuyingPrice = (buyingPrice && !isNaN(numericBuyingPrice) && numericBuyingPrice > 0)
        ? numericBuyingPrice
        : recommendation.totalBuyingPrice;
      
      const buyingPricePerUnit = finalTotalBuyingPrice / product.quantity;

      product.totalBuyingPrice = finalTotalBuyingPrice;
      product.buyingPricePerUnit = buyingPricePerUnit;
      product.status = 'approved'; 

      inspection.status = 'approved';
      inspection.buyingPricePercent = recommendation.percent;
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
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};

const getAwaitingPickup = async (req, res) => {
  try {
    const inspections = await Inspection.find({ status: 'approved', sellerPaid: false, agentId: req.user._id })
      .populate(sellerPopulate)
      .sort({ inspectedAt: 1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateLogistics = async (req, res) => {
  try {
    const { pickupDate, sellerPaid, distanceKm } = req.body;

    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    if (inspection.agentId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this inspection' });
    }

    if (pickupDate !== undefined) inspection.pickupDate = pickupDate;

    if (sellerPaid !== undefined) {
       if (sellerPaid && inspection.sellerPaid) {
        return res.status(400).json({ message: 'This pickup has already been paid' });
      }
      if (sellerPaid && (distanceKm === undefined || distanceKm === '')) {
        return res.status(400).json({ message: 'Distance from warehouse is required to complete pickup' });
      }

      if (sellerPaid) {
        
        const product = await Product.findById(inspection.productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!product.totalBuyingPrice || isNaN(product.totalBuyingPrice)) {
          return res.status(400).json({
            message: 'This product has invalid pricing data and cannot be paid out. Please contact support or re-approve it.',
          });
        }

        const { charge, rejected } = calculateDistanceCharge(distanceKm);
        if (rejected) {
          return res.status(400).json({
            message: `Distance (${distanceKm}km) exceeds the 8.75km limit. This pickup cannot be completed — please reassign to a closer agent.`,
          });
        }

        

        product.sellerDistanceCharge = charge;
        product.sellerNetPayout = product.totalBuyingPrice - charge;
        product.status = 'listed'; 
        await product.save();

        inspection.sellerPaid = true;
        inspection.distanceKm = Number(distanceKm);
        inspection.distanceCharge = charge;
        inspection.visitEarning = AGENT_FLAT_PAY + charge; // ExpiryMart's ₹30 + the seller's distance charge
        inspection.paidAt = new Date();
      }
    }

    await inspection.save();
    const populated = await inspection.populate(sellerPopulate);
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

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
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};



module.exports = { getPendingInspections, decideInspection, getAwaitingPickup, updateLogistics, getInspectionHistory };