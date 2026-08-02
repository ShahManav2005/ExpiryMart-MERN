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
const upload = require('../middleware/uploadMiddleware')

router.post('/',protect , authorize('seller') , upload.array('images' , 4) , createProduct);
router.get('/mine' , protect , authorize('seller') , getMyProducts);
router.get('/:id' , protect , authorize('seller') , getProductById);
router.put('/:id' , protect , authorize('seller') , upload.array('images',4) , updateProduct);
router.delete('/:id' , protect , authorize('seller') , deleteProduct);

module.exports = router;