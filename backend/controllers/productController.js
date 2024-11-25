import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, images } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
    }

    // Ensure images is an array and contains valid URLs
    const imageArray = Array.isArray(images) ? images.filter(url => url && url.startsWith('http')) : [];
    
    const product = new Product({
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image: imageArray.length > 0 ? imageArray[0] : "/images/default-product.jpg", // Set first image as main image
      images: imageArray, // Store all images
      countInStock: quantity
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, images } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
    }

    // Ensure images is an array and contains valid URLs
    const imageArray = Array.isArray(images) ? images.filter(url => url && url.startsWith('http')) : [];

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.brand = brand;
    product.countInStock = quantity;
    
    // Only update images if new ones are provided
    if (imageArray.length > 0) {
      product.image = imageArray[0]; // Set first image as main image
      product.images = imageArray; // Store all images
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // Add artificial delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const count = await Product.countDocuments({ ...keyword });
  
  const products = await Product.find({ ...keyword })
    .populate('category')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const totalPages = Math.ceil(count / pageSize);
  
  res.json({
    products,
    page,
    totalPages,
    hasMore: page < totalPages,
    totalProducts: count
  });
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

const updateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find the review
  const reviewToUpdate = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (!reviewToUpdate) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Update the review
  reviewToUpdate.rating = Number(rating);
  reviewToUpdate.comment = comment;

  // Recalculate average rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(200).json({ message: "Review updated" });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Get all reviews (admin)
// @route   GET /api/products/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .select('name image reviews')
      .populate({
        path: 'reviews.user',
        select: 'name email'
      });

    let allReviews = [];
    products.forEach(product => {
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach(review => {
          allReviews.push({
            _id: review._id,
            rating: review.rating,
            comment: review.comment,
            user: review.user,
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            createdAt: review.createdAt
          });
        });
      }
    });

    res.json(allReviews);
  } catch (error) {
    console.error("Error in getAllReviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Find review index
    const reviewIndex = product.reviews.findIndex(
      r => r._id.toString() === req.params.reviewId
    );

    if (reviewIndex === -1) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Remove review
    product.reviews.splice(reviewIndex, 1);

    // Recalculate rating
    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ message: error.message || "Error deleting review" });
  }
});

const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { imageUrl } = req.body;
  if (!imageUrl) {
    res.status(400);
    throw new Error("Image URL is required");
  }

  // Remove the image URL from the images array
  if (product.images) {
    product.images = product.images.filter(img => img !== imageUrl);
  }

  // If it's the main image, clear it
  if (product.image === imageUrl) {
    product.image = product.images?.[0] || ""; // Set to first image in array or empty string
  }

  await product.save();
  res.json({ message: "Image removed" });
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  getProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  updateProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  getAllReviews,
  deleteReview,
  deleteProductImage,
};
