const Product = require('../models/Product');
const Inspection = require('../models/Inspection')

//@route POST /api/products
//@access seller only

const createProduct = async (req , res) => {
    try{
        const {name,category,quantity,expiryDate,price} = req.body;

        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const product = await Product.create({
            name,
            category,
            quantity,
            expiryDate,
            price,
            images : imageUrls,
            sellerId: req.user._id,
        });

        //auto-create the matching inspection request
        await Inspection.create({
            productId : product._id,
            status : 'pending'
        })

        res.status(201).json(product);
    }catch(err){
        res.status(500).json({message : err.message});
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
            const cutofDate = new Date();
            cutoffDates.setDate(cutoffDate.getDate() + Number(maxDaysToExpriry));
            filter.expiryDate = { $lte : cutoffDate};
        }

        if(search){
             const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.name = new RegExp(search, 'i');  // case-insentative partial match
        }

        const products = await Product.find(filter).sort({expiryDate : 1})  //soonest-expriry first

        res.json(products)
    }catch(err){
        res.status(500).json({message : err.message})
    }
}
module.exports = {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getListedProducts
}