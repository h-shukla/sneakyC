const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User.addresses",
        required: true,
    },
    orderItems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    paymentInfo: {
        type: String,
        required: true,
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
