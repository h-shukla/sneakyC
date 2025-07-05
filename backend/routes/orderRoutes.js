const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrders } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');
const router = express.Router();

// Basic routes;
router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/me').get(isAuthenticatedUser, myOrders);
router.route('/order/:id').delete(isAuthenticatedUser, deleteOrders);

// Admin routes;
router.route('/admin/orders').get(isAuthenticatedUser, authorizedRoles('admin'), getAllOrders);
router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizedRoles('admin'), updateOrderStatus)
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteOrders);

module.exports = router;
