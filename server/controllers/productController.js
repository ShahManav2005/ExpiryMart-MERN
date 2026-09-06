const Product = require('../models/Product');
const Inspection = require('../models/Inspection')
const { getDaysLeft , calculateCurrentSellingPrice } = require('../utils/pricingEngine');


//@route POST /api/products
//@access seller only

const createProduct = async (req, res) => {
    try {
        const { name, category, quantity, expiryDate, price, inspectionFeeMethod } = req.body;

        if (!['card', 'upi'].includes(inspectionFeeMethod)) {
            return res.status(400).json({ message: 'Inspection fee must be paid via Card or UPI' });
        }

        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const totalMRP = Number(price) * Number(quantity);
        if (totalMRP < 200) {
        return res.status(400).json({ message: `Total MRP must be at least ₹200. Current total: ₹${totalMRP}` });
        }

        const product = await Product.create({
            name,
            category,
            quantity,
            expiryDate,
            price,
            totalMRP,
            images: imageUrls,
            sellerId: req.user._id,
            inspectionFeePaid: true,
            inspectionFeeMethod,
        });

        const Inspection = require('../models/Inspection');
        await Inspection.create({
            productId: product._id,
            status: 'pending',
        });

        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

//@route GET /api/product/mine
//@access seller only - return only this seller's own products
const getMyProducts = async (req,res)=>{
    try{
        const products = await Product.find({sellerId : req.user._id}).sort({createdAt : -1});
        res.json(products);
    }catch(err){
        res.status(500).json({message : err.message})
    }
};

//@route GET /api/products/:id
//@access seller only - must own the product
const getProductById = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message : 'Product not found'})
        }

        if(product.sellerId.toString() !== req.user._id.toString()){
            return res.status(403).json({message : 'Not autorized to view this product'});
        }

        res.json(product);
    }catch(err){
        res.status(500).json({message : err.message});
    }
}

//@route PUT /api/products/:id
//@access seller only - must own the product
const updateProduct = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message : 'Product not found'})
        }

        if(product.sellerId.toString() !== req.user._id.toString()){
            return res.status(403).json({message : 'Not authorized to edit this product'})
        }

        const {name,category,quantity,expiryDate,price} = req.body;
        product.name = name ?? product.name;
        product.category = category ?? product.category;
        product.quantity = quantity ?? product.quantity;
        product.expiryDate = expiryDate ?? product.expiryDate;
        product.price = price ?? product.price;

        if(req.files && req.files.length > 0){
            product.images = req.files.map(file => file.path);
        }

        const updated = await product.save();
        res.json(updated);
    }catch(err){
        res.status(500).json({message : err.message})
    }
}

//@route DELETE /api/products/:id
//@access seller only - must own the product
const deleteProduct = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message : 'Product not found'})
        }

        if(product.sellerId.toString() !== req.user._id.toString()){
            return res.status(403).json({message : 'Not authorized to delete this product'})
        }

        await product.deleteOne();
        res.json({message : 'Product deleted'})
    }catch(err){
        res.status(500).json({message : err.message})
    }
}

// @route GET /api/products
// @access public - buyer browse all listed products, with filters
const getListedProducts = async (req,res) => {
    try{
        const {category , minPrice , maxPrice , maxDayToExpiry , search} = req.query;

        const filter = { status : 'listed' };

        if(category){
            filter.category = category;
        }

        if(minPrice || maxPrice) {
            filter.price = {};
            if(minPrice) filter.price.$gte = Number(minPrice);
            if(maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if(maxDayToExpiry){
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() + Number(maxDayToExpiry));
            filter.expiryDate = { $lte : cutoffDate};
        }

        if(search){
             const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.name = new RegExp(search, 'i');  // case-insentative partial match
        }

        const products = await Product.find(filter).sort({expiryDate : 1})  //soonest-expriry first

        const withCurrentPricing = products
        .filter((p) => p.buyingPricePerUnit) // hide legacy/broken records missing pricing data
        .map((p) => {
            const { sellingPricePerUnit, daysLeft } = calculateCurrentSellingPrice(p.buyingPricePerUnit, p.expiryDate);
            return { ...p.toObject(), sellingPrice: sellingPricePerUnit, daysLeft };
        });

        res.json(withCurrentPricing)
    }catch(err){
        res.status(500).json({message : err.message})
    }
}

// @route GET  /api/products/public/:id
// @access public - buyer views a single listed product with pricing info
const getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.status !== 'listed' || !product.buyingPricePerUnit) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { sellingPricePerUnit, daysLeft } = calculateCurrentSellingPrice(product.buyingPricePerUnit, product.expiryDate);
    res.json({ ...product.toObject(), sellingPrice: sellingPricePerUnit, daysLeft });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/products/mine/summary
// @access seller only
const getMySalesSummary = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });

    const pending = products.filter((p) => p.status === 'pending_inspection');
    const awaitingPickup = products.filter((p) => p.status === 'approved');
    const listed = products.filter((p) => p.status === 'listed');
    const sold = products.filter((p) => p.status === 'sold');
    const rejected = products.filter((p) => p.status === 'rejected');

    const totalEarned = [...listed, ...sold].reduce((sum, p) => sum + (p.sellerNetPayout || 0), 0);

    res.json({
      products,
      counts: {
        pending: pending.length,
        awaitingPickup: awaitingPickup.length,
        listed: listed.length,
        sold: sold.length,
        rejected: rejected.length,
      },
      totalEarned,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getListedProducts,
    getPublicProductById,
    getMySalesSummary
}