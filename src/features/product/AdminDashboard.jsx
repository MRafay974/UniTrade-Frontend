import { useEffect, useState } from "react";
import axios from "../../apiInstances/axiosInstanceAuth";
import { handleError, handleSuccess } from "../../components/NavBar/utils";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/analytics");
      setAnalytics(data);
    } catch (err) {
      handleError("Failed to fetch analytics. Are you logged in as admin?");
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    setPendingLoading(true);
    try {
      const { data } = await axios.get("/products/pending");
      setPending(data);
    } catch {
      handleError("Failed to fetch pending products");
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`/products/approve/${id}`);
      handleSuccess("Product approved");
      fetchPending();
    } catch {
      handleError("Failed to approve product");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/products/reject/${id}`);
      handleSuccess("Product rejected");
      fetchPending();
    } catch {
      handleError("Failed to reject product");
    }
  };

  if (loading)
    return (
      <div className="text-center text-lg text-gray-400 py-10">
        Loading analytics...
      </div>
    );
  if (!analytics)
    return (
      <div className="text-center text-lg text-gray-400 py-10">
        No analytics data available.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4">
      {/* Hero Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-lg">
          Manage marketplace analytics and approve new products
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl shadow p-6 text-center">
          <div className="text-3xl font-extrabold text-blue-700">
            {analytics.totalUsers}
          </div>
          <div className="text-gray-700 mt-1">Total Users</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-300 rounded-xl shadow p-6 text-center">
          <div className="text-3xl font-extrabold text-green-700">
            {analytics.totalProducts}
          </div>
          <div className="text-gray-700 mt-1">Total Products</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-300 rounded-xl shadow p-6 text-center">
          <div className="text-3xl font-extrabold text-purple-700">
            {analytics.totalOrders}
          </div>
          <div className="text-gray-700 mt-1">Total Orders</div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Top Products by Sales
        </h2>
        <ul className="bg-white rounded-xl shadow divide-y divide-gray-100">
          {analytics.topProducts.length === 0 ? (
            <li className="p-4 text-gray-400">No sales data yet.</li>
          ) : (
            analytics.topProducts.map((p, idx) => (
              <li key={idx} className="flex justify-between items-center p-4">
                <span className="font-medium text-gray-700">{p.product}</span>
                <span className="text-blue-700 font-bold">
                  Sold: {p.totalSold}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pending Product Approvals */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Pending Product Approvals
        </h2>
        {pendingLoading ? (
          <div className="text-gray-400">Loading pending products...</div>
        ) : pending.length === 0 ? (
          <div className="text-green-600">No pending products!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pending.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-lg text-gray-800 mb-1">
                    {product.name}
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    {product.description}
                  </div>
                  <div className="text-gray-500 text-xs mb-2">
                    Category: {product.category} | Price: ${product.price}
                  </div>
                  {product.imageURL && product.imageURL[0] && (
                    <img
                      src={`http://localhost:9000${product.imageURL[0]}`}
                      alt={product.name}
                      className="w-full h-40 object-contain rounded mb-2 bg-gray-50"
                    />
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleApprove(product._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(product._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
