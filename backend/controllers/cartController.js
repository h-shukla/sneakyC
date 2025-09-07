const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/productModel");

exports.getAllCartItems = catchAsyncErrors(async (req, res) => {
    const cartItems = req.user.cart;
    const productIds = cartItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const cart = cartItems.map((item) => {
        const product = products.find(
            (p) => p._id.toString() === item.product.toString()
        );
        return {
            ...item.toObject(),
            product: product || null,
        };
    });

    res.status(200).json({
        success: true,
        cart,
    });
});
