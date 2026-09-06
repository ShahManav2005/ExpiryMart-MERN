const Order = require('../models/Order');
const Product = require('../models/Product');
const { calculateDeliveryEarning , calculateCurrentSellingPrice ,calculateDistanceCharge ,AGENT_FLAT_PAY} = require('../utils/pricingEngine');


const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod , deliveryAddress} = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];
    const productsToUpdate = [];

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId);
      if (!product || product.status !== 'listed') {
        return res.status(400).json({ message: `Product ${cartItem.productId} is no longer available` });
      }
      if (cartItem.quantity > product.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      const { sellingPricePerUnit } = calculateCurrentSellingPrice(product.buyingPricePerUnit, product.expiryDate);
      totalAmount += sellingPricePerUnit * cartItem.quantity;
      orderItems.push({ productId: product._id, quantity: cartItem.quantity, price: sellingPricePerUnit });
      productsToUpdate.push({ product, quantity: cartItem.quantity });
    }

    if (totalAmount < 200) {
      return res.status(400).json({ message: `Minimum cart value is ₹200. Your cart totals ₹${totalAmount}` });
    }

    for (const { product, quantity } of productsToUpdate) {
      product.quantity -= quantity;
      if (product.quantity === 0) product.status = 'sold';
      await product.save();
    }

    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      totalAmount,
      orderStatus: 'placed',
      paymentMethod: paymentMethod || 'mock',
      deliveryAddress: deliveryAddress || req.user.address,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/delivery-queue
// @access agent only
const getDeliveryQueue = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryStatus: 'pending' })
      .populate('buyerId', 'name phone address')
      .populate('items.productId', 'name images')
      .sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/orders/:id/deliver
// @access agent only
const completeDelivery = async (req, res) => {
  try {
    const { distanceKm } = req.body;
    if (distanceKm === undefined || distanceKm === '') {
      return res.status(400).json({ message: 'Distance from warehouse is required to complete delivery' });
    }

    const { charge, rejected } = calculateDistanceCharge(distanceKm);
    if (rejected) {
      return res.status(400).json({
        message: `Distance (${distanceKm}km) exceeds the 8.75km limit. This delivery cannot be completed — please reassign to a closer agent.`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.deliveryStatus === 'delivered') {
      return res.status(400).json({ message: 'This order has already been delivered' });
    }

    order.deliveryAgentId = req.user._id;
    order.deliveryStatus = 'delivered';
    order.deliveryDistanceKm = Number(distanceKm);
    order.deliveryCharge = charge;
    order.deliveryEarning = AGENT_FLAT_PAY + charge; // ExpiryMart's ₹30 + the buyer's distance charge
    order.deliveredAt = new Date();
    order.orderStatus = 'delivered';

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getDeliveryQueue, completeDelivery };