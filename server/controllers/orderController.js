const Order = require('../models/Order');
const Product = require('../models/Product');

// @route POST /api/orders
// @access buyer only
const createOrder = async (req, res) => {
  try {
    const { items , paymentMethod } = req.body; // [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId);

      if (!product || product.status !== 'listed') {
        return res.status(400).json({ message: `Product ${cartItem.productId} is no longer available` });
      }

      if (cartItem.quantity > product.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      const price = product.sellingPrice;
      totalAmount += price * cartItem.quantity;

      orderItems.push({
        productId: product._id,
        quantity: cartItem.quantity,
        price,
      });

      // reduce stock, mark sold if fully depleted
      product.quantity -= cartItem.quantity;
      if (product.quantity === 0) {
        product.status = 'sold';
      }
      await product.save();
    }

    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      totalAmount,
      orderStatus: 'placed',
      paymentMethod: paymentMethod || 'mock',
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/mine
// @access buyer only
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

module.exports = { createOrder, getMyOrders };