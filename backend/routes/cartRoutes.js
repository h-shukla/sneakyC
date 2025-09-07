const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/auth");
const { getAllCartItems } = require("../controllers/cartController");
const router = express.Router();

router.route("/cart/").get(isAuthenticatedUser, getAllCartItems);

module.exports = router;
