const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");

// Create --> Admin
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.create(req.body);

    if (!category) {
        return next(new ErrorHandler());
    }

    res.status(200).json({
        success: true,
        category,
    });
});

exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find();

    if (!categories) {
        return next(new ErrorHandler("No categories found", 404));
    }

    res.status(200).json({
        success: true,
        categories,
    });
});

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    console.log("reached");
    const category = await Category.findByIdAndUpdate(req.params.id, req.body);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    res.status(200).json({
        success: true,
        category,
    });
});

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    res.status(200).json({
        success: true,
        category,
    });
});
