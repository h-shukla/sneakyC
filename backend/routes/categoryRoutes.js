const express = require("express");
const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const { authorizedRoles, isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router
    .route("/category")
    .get(getAllCategories)
    .post(isAuthenticatedUser, authorizedRoles("admin"), createCategory);
router
    .route("/category/:id")
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateCategory);
router
    .route("/category/:id")
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteCategory);

module.exports = router;
