import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      const result = await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      
      toast.success("Review added successfully");
      setRating(0);
      setComment("");
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message || 
        (error.status === 403 ? "You can only review products you have purchased and received" : 
         error.status === 400 ? "You have already reviewed this product" :
         "Error submitting review");
      
      toast.error(errorMessage);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "category", label: "Category Details" },
    { id: "reviews", label: `Reviews (${product?.reviews?.length || 0})` },
  ];

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={(e) => {
              e.preventDefault();
              setRating(star);
            }}
            className={`text-2xl ${
              star <= rating ? "text-yellow-500" : "text-gray-400"
            } hover:text-yellow-500 transition-colors`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-white">{rating} out of 5</span>
        )}
      </div>
    );
  };

  const tabContent = {
    description: (
      <div className="text-[#B0B0B0]">
        {product?.description}
      </div>
    ),
    category: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#B0B0B0]">
        <p>Category: {product?.category?.name}</p>
        <p>Camera Type: {product?.category?.cameraType}</p>
        <p>Sensor Size: {product?.category?.sensorSize}</p>
        <p>Primary Use: {product?.category?.primaryUseCase}</p>
      </div>
    ),
    reviews: (
      <div className="space-y-4">
        {userInfo ? (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Rating <span className="text-pink-500">*</span></label>
              {renderStars()}
              {rating === 0 && (
                <p className="text-sm text-gray-400 mt-1">Click the stars to rate</p>
              )}
            </div>
            <div>
              <label className="block text-white mb-2">Review <span className="text-pink-500">*</span></label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                className="w-full p-2 rounded-lg bg-[#252525] text-white border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                placeholder="Share your experience with this product..."
              />
            </div>
            <button
              type="submit"
              disabled={loadingProductReview}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingProductReview ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        ) : (
          <div className="bg-[#252525] p-4 rounded-lg">
            <p className="text-white mb-2">Please <Link to="/login" className="text-pink-500 hover:underline">sign in</Link> to write a review.</p>
            <p className="text-sm text-gray-400">Only verified purchasers can review products.</p>
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
          {product?.reviews?.length === 0 ? (
            <p className="text-[#B0B0B0]">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-4">
              {product?.reviews?.map((review) => (
                <div key={review._id} className="bg-[#252525] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{review.name}</span>
                    <span className="text-[#B0B0B0] text-sm">
                      {moment(review.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className="text-yellow-500">
                        {review.rating > index ? (
                          review.rating - index >= 1 ? (
                            <FaStar />
                          ) : (
                            <FaStarHalfAlt />
                          )
                        ) : (
                          <FaRegStar />
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#B0B0B0]">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto px-4">
        <div className="pt-32 pb-20">
          <Link
            to="/"
            className="text-white font-semibold hover:underline inline-block mb-12"
          >
            Go Back
          </Link>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.message}
            </Message>
          ) : (
            <div className="flex flex-col lg:flex-row gap-16 mt-12 items-start justify-between">
              {/* Left Column - Product Image */}
              <div className="w-full lg:w-[30%]">
                <div className="relative bg-[#1A1A1A] p-6 rounded-lg shadow-xl h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="absolute top-8 right-8">
                    <HeartIcon product={product} />
                  </div>
                </div>
              </div>

              {/* Middle Column - Product Details */}
              <div className="w-full lg:w-[30%]">
                <div className="space-y-8 bg-[#1A1A1A] p-8 rounded-lg shadow-xl h-full">
                  <h2 className="text-3xl font-semibold">{product.name}</h2>
                  <p className="text-[#B0B0B0] text-lg">{product.description}</p>
                  <p className="text-5xl font-extrabold text-pink-500">$ {product.price}</p>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h1 className="flex items-center">
                        <FaStore className="mr-3 text-pink-500 text-xl" /> 
                        <span>
                          <span className="text-[#B0B0B0] block text-sm">Brand</span>
                          <span className="text-white">{product.brand}</span>
                        </span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaClock className="mr-3 text-pink-500 text-xl" /> 
                        <span>
                          <span className="text-[#B0B0B0] block text-sm">Added</span>
                          <span className="text-white">{moment(product.createAt).fromNow()}</span>
                        </span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaStar className="mr-3 text-pink-500 text-xl" /> 
                        <span>
                          <span className="text-[#B0B0B0] block text-sm">Reviews</span>
                          <span className="text-white">{product.numReviews}</span>
                        </span>
                      </h1>
                    </div>

                    <div className="space-y-6">
                      <h1 className="flex items-center">
                        <FaStar className="mr-3 text-pink-500 text-xl" /> 
                        <span>
                          <span className="text-[#B0B0B0] block text-sm">Rating</span>
                          <span className="text-white">{rating}</span>
                        </span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaShoppingCart className="mr-3 text-pink-500 text-xl" /> 
                        <span>
                          <span className="text-[#B0B0B0] block text-sm">Quantity</span>
                          <span className="text-white">{product.quantity}</span>
                        </span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaBox className="mr-3 text-pink-500 text-xl" /> 
                        <span>
                          <span className="text-[#B0B0B0] block text-sm">In Stock</span>
                          <span className="text-white">{product.countInStock}</span>
                        </span>
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-700 pt-8">
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />

                    {product.countInStock > 0 && (
                      <div className="flex items-center bg-white rounded-lg border-2 border-pink-500">
                        <button 
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="px-4 py-2 text-pink-500 hover:bg-pink-50 rounded-l-lg transition-colors text-xl font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-black font-semibold min-w-[3rem] text-center">
                          {qty}
                        </span>
                        <button 
                          onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                          className="px-4 py-2 text-pink-500 hover:bg-pink-50 rounded-r-lg transition-colors text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="w-full bg-pink-600 text-white py-4 px-8 rounded-lg hover:bg-pink-700 transition-colors text-lg font-semibold shadow-lg"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>

              {/* Right Column - Tabs */}
              <div className="w-full lg:w-[30%]">
                <div className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-xl h-full">
                  <div className="flex flex-col border-b border-gray-700">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-5 text-left transition-colors relative hover:bg-[#252525] ${
                          activeTab === tab.id
                            ? "text-white font-semibold border-l-4 border-pink-500 bg-[#252525]"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="p-8">
                    {tabContent[activeTab]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
