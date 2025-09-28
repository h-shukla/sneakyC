const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
    getAllCartItems,
    addOrUpdateCartItem,
    deleteCartItem,
} = require("../controllers/cartController");
const router = express.Router();

router
    .route("/cart")
    .get(isAuthenticatedUser, getAllCartItems)
    .post(isAuthenticatedUser, addOrUpdateCartItem);
router.route("/cart/:productId").delete(isAuthenticatedUser, deleteCartItem);

module.exports = router;
