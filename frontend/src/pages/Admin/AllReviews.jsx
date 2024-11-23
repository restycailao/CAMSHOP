import { useGetAllReviewsQuery, useDeleteReviewMutation } from "../../redux/api/reviewApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { FaTrash, FaStar } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const AllReviews = () => {
  const { data: reviews, isLoading, error, refetch } = useGetAllReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();

  const handleDeleteReview = (productId, reviewId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this review?</p>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            onClick={() => {
              deleteReview({ productId, reviewId })
                .unwrap()
                .then(() => {
                  toast.success("Review deleted successfully");
                  refetch();
                })
                .catch((err) => {
                  toast.error(err?.data?.message || err.error || "Error deleting review");
                });
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="error">{error?.data?.message || error.error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#151515] rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Product Reviews</h1>
        </div>

        {reviews?.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No reviews found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1A1A1A] rounded-lg">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-white">Product</th>
                  <th className="px-6 py-3 text-left text-white">User</th>
                  <th className="px-6 py-3 text-left text-white">Rating</th>
                  <th className="px-6 py-3 text-left text-white">Comment</th>
                  <th className="px-6 py-3 text-left text-white">Date</th>
                  <th className="px-6 py-3 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {reviews?.map((review) => (
                  <tr key={review._id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/product/${review.productId}`}
                        className="flex items-center space-x-3 text-white hover:text-pink-500"
                      >
                        <img
                          src={review.productImage}
                          alt={review.productName}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>{review.productName}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{review.user.name}</div>
                      <div className="text-gray-400 text-sm">{review.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-500">
                        {[...Array(review.rating)].map((_, index) => (
                          <FaStar key={index} className="mr-1" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white max-w-xs truncate">{review.comment}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {moment(review.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteReview(review.productId, review._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Review"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReviews;
