import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="w-full h-full bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            className="cursor-pointer w-full rounded-t-lg"
            src={p.image}
            alt={p.name}
            style={{ height: "300px", objectFit: "contain", width: "100%", backgroundColor: "#151515" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-4 flex flex-col flex-grow space-y-3">
        {/* Title and Brand */}
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h5 className="text-lg font-medium text-white dark:text-white">{p?.name}</h5>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              {p?.brand}
            </span>
          </div>
        </div>

        {/* Category Details */}
        <div className="space-y-1">
          <p className="text-sm text-[#CFCFCF]">
            Category: {p?.category?.name}
          </p>
          <p className="text-sm text-[#CFCFCF]">
            Camera Type: {p?.category?.cameraType}
          </p>
          <p className="text-sm text-[#CFCFCF]">
            Sensor Size: {p?.category?.sensorSize}
          </p>
          <p className="text-sm text-[#CFCFCF]">
            Primary Use: {p?.category?.primaryUseCase}
          </p>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <p className="text-sm text-[#CFCFCF]">
            Stock: {p?.countInStock} available
          </p>
          <p className="text-sm text-[#CFCFCF]">
            Quantity: {p?.quantity}
          </p>
          <p className="text-sm text-[#CFCFCF]">
            Rating: {p?.rating} ({p?.numReviews} reviews)
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#CFCFCF] line-clamp-2">
          {p?.description}
        </p>

        {/* Price and Actions */}
        <div className="flex justify-between items-center pt-2 mt-auto">
          <p className="text-xl font-bold text-pink-500">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          
          <div className="flex items-center gap-2">
            <Link
              to={`/product/${p._id}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
            >
              Details
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>

            <button
              className={`p-2 rounded-full transition-colors ${
                p?.countInStock === 0 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white hover:text-pink-500'
              }`}
              onClick={() => p?.countInStock > 0 && addToCartHandler(p, 1)}
              disabled={p?.countInStock === 0}
              title={p?.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <AiOutlineShoppingCart size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
