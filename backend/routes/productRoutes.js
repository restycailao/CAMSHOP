import express from "express";
import formidable from "express-formidable";
const router = express.Router();

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  getProducts,
  fetchProductById,
  fetchAllProducts,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  getAllReviews,
  deleteReview,
  deleteProductImage,
  addProductReview,
  updateProductReview,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import verifyPurchase from "../middlewares/verifyPurchase.js";
import filterBadWords from "../middlewares/filterBadWords.js";

// Public routes
router.route("/").get(getProducts);
router.route("/allProducts").get(fetchAllProducts);
router.route("/filtered-products").post(filterProducts);
router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);

// Protected routes
router
  .route("/")
  .post(authenticate, authorizeAdmin, addProduct);

router
  .route("/:id")
  .get(checkId, fetchProductById)
  .put(authenticate, authorizeAdmin, checkId, updateProductDetails)
  .delete(authenticate, authorizeAdmin, checkId, removeProduct);

// Image management
router
  .route("/:id/image")
  .delete(authenticate, authorizeAdmin, checkId, deleteProductImage);

// Reviews
router
  .route("/:id/reviews")
  .get(getAllReviews)
  .post(authenticate, checkId, verifyPurchase, filterBadWords, addProductReview)
  .delete(authenticate, authorizeAdmin, deleteReview);

router
  .route("/:id/reviews/update")
  .put(authenticate, checkId, filterBadWords, updateProductReview);

export default router;
