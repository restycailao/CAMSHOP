import Order from '../models/orderModel.js';
import asyncHandler from './asyncHandler.js';
import Product from '../models/productModel.js'; // Added missing import

const verifyPurchase = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    // Find orders for this user that contain the product
    const orders = await Order.find({
      user: userId,
      'orderItems.product': productId,
      isPaid: true,
      isDelivered: true
    });

    if (!orders || orders.length === 0) {
      return res.status(403).json({
        message: 'You can only review products you have purchased and received'
      });
    }

    // Check if user has already reviewed this product
    const product = await Product.findById(productId);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === userId.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({
          message: 'You have already reviewed this product'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Verify Purchase Error:', error);
    res.status(500).json({
      message: 'Error verifying purchase'
    });
  }
});

export default verifyPurchase;
