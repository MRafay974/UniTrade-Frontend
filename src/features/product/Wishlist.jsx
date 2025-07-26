import { useEffect, useState } from "react";
import axios from "../../apiInstances/axiosInstanceAuth";
import { handleError, handleSuccess } from "../../components/NavBar/utils";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/wishlist/");
      setWishlist(data);
    } catch (err) {
      handleError("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      await axios.delete("/wishlist/remove", { data: { productId } });
      fetchWishlist();
    } catch {
      handleError("Failed to remove item");
    }
  };

  if (loading)
    return (
      <div className="text-center text-lg text-gray-400 py-10">
        Loading wishlist...
      </div>
    );
  if (!wishlist || !wishlist.products.length)
    return (
      <div className="text-center text-lg text-gray-400 py-10">
        Your wishlist is empty.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Wishlist</h2>
      <ul className="divide-y divide-gray-200">
        {wishlist.products.map((product) => (
          <li
            key={product._id}
            className="flex items-center justify-between py-4"
          >
            <span
              className="font-semibold text-blue-600 cursor-pointer hover:underline"
              onClick={() =>
                navigate(`/product/view/${product._id}`, { state: { product } })
              }
            >
              {product.name}
            </span>
            <button
              onClick={() => removeItem(product._id)}
              className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded transition"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
