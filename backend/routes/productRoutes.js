const express = require('express');
const { getAllProducts,
    createProduct,
    getProductDetails,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview } = require('../controllers/productController');
const router = express.Router();

// admin routes
router.route('/admin/products/new').post(createProduct);
router.route('/admin/products/:id')
    .put(updateProduct)
    .delete(deleteProduct);

// Non admin routes;
router.route('/products').get(getAllProducts);
router.route('/products/:id').get(getProductDetails);

module.exports = router;
