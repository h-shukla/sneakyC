const express = require("express");
const {
    getAllProducts,
    createProduct,
    getProductDetails,
    updateProduct,
    deleteProduct,
    getHomeProducts,
    // createProductReview,
    // getProductReviews,
    // deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const router = express.Router();

// admin routes
router
    .route("/admin/products/new")
    .post(
        isAuthenticatedUser,
        authorizedRoles("admin"),
        upload.array("images", 4),
        createProduct
    );

router
    .route("/admin/products/:id")
    .put(
        isAuthenticatedUser,
        authorizedRoles("admin"),
        upload.single("image"),
        updateProduct
    )
    .delete(deleteProduct);

// Non admin routes;
router.route("/products").get(getAllProducts);
router.route("/products/home").get(getHomeProducts);
router.route("/products/:id").get(getProductDetails);

module.exports = router;
