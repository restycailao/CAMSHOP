import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useCancelOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    error: errorPayPal,
    isLoading: loadingPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId).unwrap();
      refetch();
      toast.success("Order cancelled successfully");
      setCancelDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel order");
    }
  };

  const showCancelButton = () => {
    return (
      order &&
      order.isPaid &&
      !order.isDelivered &&
      (userInfo._id === order.user._id || userInfo.isAdmin) &&
      order.status !== "Cancelled"
    );
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container mx-auto pt-[90px] px-4 bg-[#0E0E0E] text-white">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="border-b border-gray-700 pb-4 mb-5">
            <h2 className="text-2xl font-semibold mb-4">Order {order._id}</h2>
            <div className="mb-4">
              <h3 className="text-xl mb-2">Shipping</h3>
              <div className="ml-4">
                <p>
                  <strong className="text-pink-500">Name: </strong> {order.user.name}
                </p>
                <p>
                  <strong className="text-pink-500">Email: </strong> {order.user.email}
                </p>
                <p>
                  <strong className="text-pink-500">Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
                <div className="mt-2">
                  {order.status === "Cancelled" ? (
                    <Message variant="danger">
                      Order Cancelled
                    </Message>
                  ) : order.isDelivered ? (
                    <Message variant="success">
                      Delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl mb-2">Payment Method</h3>
              <div className="ml-4">
                <p>
                  <strong className="text-pink-500">Method: </strong>
                  {order.paymentMethod}
                </p>
                <div className="mt-2">
                  {order.isPaid ? (
                    <Message variant="success">
                      Paid on {order.paidAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl mb-2">Order Items</h3>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left">Item</th>
                        <th className="px-4 py-3 text-left">Quantity</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover"
                              />
                              <Link
                                to={`/product/${item.product}`}
                                className="ml-4 hover:text-pink-500"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </td>
                          <td className="px-4 py-3">{item.qty}</td>
                          <td className="px-4 py-3">${item.price}</td>
                          <td className="px-4 py-3">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-[#1A1A1A] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div className="mt-4">
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && 
              userInfo.isAdmin && 
              order.isPaid && 
              !order.isDelivered && 
              order.status !== "Cancelled" && (
              <div className="mt-4">
                <button
                  className="bg-pink-500 text-white w-full py-2 hover:bg-pink-600"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}

            {showCancelButton() && (
              <div className="mt-4">
                <button
                  className="bg-red-500 text-white w-full py-2 hover:bg-red-600"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
          cancelDialogOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-[#1A1A1A] p-6 rounded-lg w-1/2">
          <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
          <p>
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
          {order?.isPaid && (
            <p className="mt-2 text-red-500">
              Note: Since this order has been paid, a refund will be initiated according
              to our refund policy.
            </p>
          )}
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-500 text-white w-full py-2 hover:bg-gray-600"
              onClick={() => setCancelDialogOpen(false)}
            >
              No, Keep Order
            </button>
            <button
              className="bg-red-500 text-white w-full py-2 hover:bg-red-600"
              onClick={handleCancelOrder}
            >
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
