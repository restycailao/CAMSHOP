import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto pt-[90px] px-4">
      <div className="max-w-6xl mx-auto">
        <ProgressSteps step1 step2 step3 />

        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="mt-8">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {cart.cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-4">
                        <Link to={`/product/${item.product}`} className="hover:text-pink-500">
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-4">{item.qty}</td>
                      <td className="p-4">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        ${(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-pink-500">Address:</strong>{" "}
                      {cart.shippingAddress.address}
                    </p>
                    <p>
                      <strong className="text-pink-500">City:</strong>{" "}
                      {cart.shippingAddress.city}
                    </p>
                    <p>
                      <strong className="text-pink-500">Postal Code:</strong>{" "}
                      {cart.shippingAddress.postalCode}
                    </p>
                    <p>
                      <strong className="text-pink-500">Country:</strong>{" "}
                      {cart.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                  <p>
                    <strong className="text-pink-500">Method:</strong>{" "}
                    {cart.paymentMethod}
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-[#181818] p-6 rounded">
                  <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Items</span>
                      <span>${cart.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${cart.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${cart.taxPrice}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-4">
                      <span>Total</span>
                      <span>${cart.totalPrice}</span>
                    </div>

                    {error && (
                      <div className="mt-4">
                        <Message variant="danger">{error.data.message}</Message>
                      </div>
                    )}

                    <button
                      type="button"
                      className="w-full bg-pink-500 text-white py-3 px-4 rounded hover:bg-pink-600 transition-colors mt-6"
                      disabled={cart.cartItems === 0}
                      onClick={placeOrderHandler}
                    >
                      Place Order
                    </button>

                    {isLoading && <Loader />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
