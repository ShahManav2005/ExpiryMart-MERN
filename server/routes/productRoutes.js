const express = require('express');
const router = express.Router();
const {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getListedProducts,
    getMySalesSummary,
    getPublicProductById,
    getProductInvoice
} = require('../controllers/productController')

const {protect , authorize} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware')

router.post('/',protect , authorize('seller') , upload.array('images' , 4) , createProduct);
router.get('/mine/summary', protect, authorize('seller'), getMySalesSummary);
router.get('/mine' , protect , authorize('seller') , getMyProducts);
router.get('/:id' , protect , authorize('seller') , getProductById);
router.put('/:id' , protect , authorize('seller') , upload.array('images',4) , updateProduct);
router.delete('/:id' , protect , authorize('seller') , deleteProduct);
router.get('/',getListedProducts)
router.get('/public/:id',getPublicProductById);
router.get('/:id/invoice', protect, authorize('seller'), getProductInvoice);


module.exports = router;