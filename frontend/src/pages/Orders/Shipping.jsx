import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto pt-[90px] px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressSteps step1 step2 />
        
        <div className="mt-8">
          <form onSubmit={submitHandler} className="p-8 rounded-lg">
            <h1 className="text-2xl font-semibold mb-6">Shipping</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">Address</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded focus:outline-none focus:border-pink-500"
                  placeholder="Enter address"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-white mb-2">City</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded focus:outline-none focus:border-pink-500"
                  placeholder="Enter city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-white mb-2">Postal Code</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded focus:outline-none focus:border-pink-500"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-white mb-2">Country</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded focus:outline-none focus:border-pink-500"
                  placeholder="Enter country"
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div className="border-t pt-6">
                <label className="block text-gray-400 mb-3">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="form-radio text-pink-500"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-white">PayPal or Credit Card</span>
                  </label>
                </div>
              </div>

              <button
                className="w-full bg-pink-500 text-white py-3 px-4 rounded hover:bg-pink-600 transition-colors mt-6"
                type="submit"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
