import { useEffect, useState } from "react";
import axios from "../../apiInstances/axiosInstanceAuth";
import { handleError } from "../../components/NavBar/utils";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/order/my");
      setOrders(data);
    } catch (err) {
      handleError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="text-center text-lg text-gray-400 py-10">
        Loading orders...
      </div>
    );
  if (!orders.length)
    return (
      <div className="text-center text-lg text-gray-400 py-10">
        You have no orders yet.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-gray-700">
                Order #{order._id}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="mb-2">
              Status:{" "}
              <span className="font-medium text-blue-600">{order.status}</span>
            </div>
            <div className="mb-2">
              Total:{" "}
              <span className="font-bold text-green-600">${order.total}</span>
            </div>
            <div className="mb-2">
              Items:
              <ul className="list-disc list-inside ml-4">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity} x {item.product?.name || item.product}{" "}
                    {item.product?.price ? `($${item.product.price})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
