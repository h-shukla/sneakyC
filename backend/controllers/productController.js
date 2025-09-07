const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
// const cloudinary = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");
const Category = require("../models/categoryModel");

// Create new product --> Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let imagePaths = [];

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
        // Store the local file paths
        for (const file of req.files) {
            if (file.path) {
                imagePaths.push(file.path);
            }
        }
    } else {
        // If images are required by schema, return an error
        return next(new ErrorHandler("Please upload at least one image.", 400));
    }

    // Assign the local image paths to req.body properties
    // Store local file paths instead of Cloudinary URLs
    req.body.image = imagePaths;
    req.body.imagePublicId = imagePaths;

    // Ensure price and stock are numbers
    req.body.price = Number(req.body.price);
    req.body.stock = Number(req.body.stock);

    // Create the product with local image paths
    const product = await Product.create(req.body);

    if (!product) {
        return next(new ErrorHandler("Failed to create product.", 500));
    }

    res.status(201).json({
        success: true,
        product,
    });
});

// Get all products for listing --> Non Admin
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultsPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultsPerPage);
    const products = await apiFeatures.query;
    if (!products) {
        return next(new ErrorHandler());
    }
    res.status(200).json({
        success: true,
        productsCount,
        products,
    });
});

// Get specific product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Update product --> Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Delete previous image from Cloudinary if image is being updated
    if (
        req.body.images &&
        req.body.images.length > 0 &&
        product.images &&
        product.images.length > 0
    ) {
        for (let img of product.images) {
            if (img.public_id) {
                // await cloudinary.uploader.destroy(img.public_id);
            }
        }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// Delete product --> Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Check if product has images
    if (product.image && product.image.length > 0) {
        product.image.forEach((imgPath) => {
            // Normalize path to handle backslashes on Windows
            const fullPath = path.join(__dirname, "..", imgPath);

            fs.rm(fullPath, { force: true }, (err) => {
                if (err) {
                    console.error(
                        `❌ Failed to delete image ${fullPath}:`,
                        err
                    );
                } else {
                    console.log(`🗑️ Deleted image: ${fullPath}`);
                }
            });
        });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: `Product deleted with id: ${req.params.id}`,
    });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productID } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productID);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get all reviews of single product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete product review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productID);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // keeping all the reviews that we don't want to delete
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );
    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    const ratings = (product.ratings = avg / reviews.length);

    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productID, {
        reviews,
        ratings,
        numOfReviews,
    });

    res.status(200).json({
        success: true,
        reviews: product.review,
    });
});

// Get products for homepage listings --> Non Admin
exports.getHomeProducts = catchAsyncErrors(async (req, res, next) => {
    const resultsPerPage = 6;

    // Get the total product count
    const productsCount = await Product.countDocuments();

    // Best Selling Products (sorted by highest sold count)
    const bestSellingProducts = await Product.find()
        .sort({ sold: -1 })
        .limit(resultsPerPage);

    // Flash Sale Products (sorted by lowest sold count)
    const flashSaleProducts = await Product.find()
        .sort({ sold: 1 })
        .limit(resultsPerPage);

    // const categories = await Category.find().select("-_id");
    const categories = await Category.find();

    if (!bestSellingProducts || !flashSaleProducts || !categories) {
        return next(new ErrorHandler("Products & Categories not found"));
    }

    // Return both arrays in the response
    res.status(200).json({
        success: true,
        productsCount,
        bestSellingProducts,
        flashSaleProducts,
        categories,
    });
});
