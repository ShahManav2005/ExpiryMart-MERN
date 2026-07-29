const express = require('express');
const router = express.Router();
const {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')

const {protect , authorize} = require('../middleware/authMiddleware');

router.post('/',protect , authorize('seller') , createProduct);
router.get('/mine' , protect , authorize('seller') , getMyProducts);
router.get('/:id' , protect , authorize('seller') , getProductById);
router.put('/:id' , protect , authorize('seller') , updateProduct);
router.delete('/:id' , protect , authorize('seller') , deleteProduct);

module.exports = router;