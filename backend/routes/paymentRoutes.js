const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
    createOrder,
    verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.route("/pay/create-order").post(isAuthenticatedUser, createOrder);
router.route("/pay/verify-payment").post(isAuthenticatedUser, verifyPayment);

module.exports = router;
