const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/productModel");

// @desc    Get all cart items
exports.getAllCartItems = catchAsyncErrors(async (req, res) => {
    const cartItems = req.user.cart;

    if (!cartItems || cartItems.length === 0) {
        return res.status(200).json({ success: true, cart: [] });
    }

    const productIds = cartItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const cart = cartItems.map((item) => {
        const product = products.find(
            (p) => p._id.toString() === item.product.toString()
        );

        return {
            ...item.toObject(),
            product: product || null, // In case product is deleted
        };
    });

    res.status(200).json({
        success: true,
        cart,
    });
});

// @desc    Add or update cart item
exports.addOrUpdateCartItem = catchAsyncErrors(async (req, res) => {
    const user = req.user;
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid input" });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res
            .status(404)
            .json({ success: false, message: "Product not found" });
    }

    const existingItem = user.cart.find(
        (item) => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity = quantity; // set, not +=
    } else {
        user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart: user.cart,
    });
});

// @desc    Delete cart item
exports.deleteCartItem = catchAsyncErrors(async (req, res) => {
    const user = req.user;
    const { productId } = req.params;

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
        (item) => item.product._id.toString() !== productId
    );

    if (user.cart.length === initialLength) {
        return res
            .status(404)
            .json({ success: false, message: "Product not found in cart" });
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart: user.cart,
    });
});
