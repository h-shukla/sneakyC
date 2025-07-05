const express = require('express');
const { registerUser,
        loginUser,
        logoutUser,
        getUserDetails,
        updateProfile,
        getAllUsers,
        getSingleUser,
        updateUserRole,
        deleteUser } = require('../controllers/userController');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');

// Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizedRoles('admin'), getSingleUser)
    .put(isAuthenticatedUser, authorizedRoles('admin'), updateUserRole)
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser);

// Non admin routes;
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/update').post(isAuthenticatedUser, updateProfile);

module.exports = router;
