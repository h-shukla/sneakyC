const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.createOrder = catchAsyncErrors((req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Hello, world",
    });
});
exports.verifyPayment = () => {};
