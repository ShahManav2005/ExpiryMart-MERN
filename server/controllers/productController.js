const Product = require('../models/Product');

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
module.exports = {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}