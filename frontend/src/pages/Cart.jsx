import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantity = (item, newQty) => {
    if (newQty > 0 && newQty <= item.countInStock) {
      addToCartHandler(item, newQty);
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link to="/shop" className="text-pink-500 hover:text-pink-600">
              Go To Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-6 px-4">
            <h1 className="text-2xl font-semibold text-center">Shopping Cart</h1>

            <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-700">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-lg">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item._id}`} className="text-pink-500 hover:text-pink-600 font-medium">
                        {item.name}
                      </Link>
                      <div className="mt-1 text-gray-300">{item.brand}</div>
                      <div className="mt-1 text-white font-bold">
                        $ {item.price}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        className="p-2 text-pink-500 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQuantity(item, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        <FaMinus size={14} />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.qty}</span>
                      
                      <button
                        className="p-2 text-pink-500 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQuantity(item, item.qty + 1)}
                        disabled={item.qty >= item.countInStock}
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>

                    <button
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg mx-auto max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg">
                  Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                </h2>
                <div className="text-2xl font-bold">
                  $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </div>
              </div>

              <button
                className="bg-pink-500 hover:bg-pink-600 transition-colors py-3 px-4 rounded-full text-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
