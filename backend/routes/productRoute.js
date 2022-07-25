const express = require("express");
const { getaAllProducts, createProduct, createProductReview, updateProduct, deleteProduct, getProductDetails, deleteReview, getAllReviews, getaAdminProducts } = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/admin/products").get( isAuthenticatedUser, authorizeRoles("admin"), getaAdminProducts)

router.route('/products').get( getaAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
router.route("/product/:id").get( getProductDetails)

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(getAllReviews).delete(isAuthenticatedUser, deleteReview)


module.exports = router