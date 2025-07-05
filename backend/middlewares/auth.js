const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const token = req.query.token
    if (!token) {
        return next(new ErrorHandler('Please Login to access this resource', 401))
    }

    // verifiying the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
})

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        // getting the user's roles from req
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            )
        }
        next()
    }
}