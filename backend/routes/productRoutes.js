import express from "express";
const router = express.Router();
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  getProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  getAllReviews,
  deleteReview,
  deleteProductImage,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import verifyPurchase from "../middlewares/verifyPurchase.js";
import filterBadWords from "../middlewares/filterBadWords.js";

// Reviews route (must be before /:id routes to avoid conflict)
router.get("/all-reviews", authenticate, authorizeAdmin, getAllReviews);

// Public routes
router.route("/").get(getProducts);
router.route("/allProducts").get(fetchAllProducts);
router.route("/filtered-products").post(filterProducts);
router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);

// Admin routes
router
  .route("/")
  .post(authenticate, authorizeAdmin, addProduct);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, checkId, updateProductDetails)
  .delete(authenticate, authorizeAdmin, checkId, removeProduct);

// Image management
router
  .route("/:id/image")
  .delete(authenticate, authorizeAdmin, checkId, deleteProductImage);

// Product reviews
router
  .route("/:id/reviews")
  .post(authenticate, checkId, verifyPurchase, filterBadWords, addProductReview);

router
  .route("/:id/reviews/:reviewId")
  .delete(authenticate, authorizeAdmin, checkId, deleteReview);

export default router;
