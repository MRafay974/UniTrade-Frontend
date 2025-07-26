import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import axios from "../../apiInstances/axiosInstanceAuth";
import { handleSuccess, handleError } from "../../components/NavBar/utils";
import { BACKEND_BASE_URL } from "../../apiInstances/baseurl";


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const hasSale =
    product.salePrice &&
    parseFloat(product.salePrice) < parseFloat(product.price);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) =>
    price ? `$${parseFloat(price).toFixed(2)}` : "";

  const handleViewClick = () => {
    navigate(`/product/view/${product._id}`, { state: { product } });
  };

  const handleAddToCart = async () => {
    try {
      await axios.post("/cart/add", { productId: product._id, quantity: 1 });
      handleSuccess("Added to cart!");
    } catch {
      handleError("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post("/wishlist/add", { productId: product._id });
      handleSuccess("Added to wishlist!");
    } catch {
      handleError("Failed to add to wishlist");
    }
  };

  return (
    <div
      className="product-card p-4 border rounded-lg shadow-lg bg-white relative transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gray-100">
        <img

        /// src={`http://localhost:9000${product.imageURL[0]}`}
        ///BACKEND_BASE_URL
          src={`${BACKEND_BASE_URL}${product.imageURL[0]}`}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
        {product.category && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleViewClick}
            className="rounded-full bg-white p-3 shadow-lg hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="View product"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-white p-3 shadow-lg hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={handleAddToWishlist}
            className="rounded-full bg-white p-3 shadow-lg hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="product-details mt-4">
        <div className="product-info mb-2">
          <h4 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h4>
          <div className="product-price flex gap-2 items-center">
            {hasSale ? (
              <>
                <span className="text-green-600 font-bold text-lg">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="line-through text-gray-400 text-sm">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-gray-700 font-bold text-lg">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
        <p className="product-description text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="product-footer mt-4 flex justify-end">
        <button
          onClick={handleViewClick}
          className="view-btn p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <FaEye size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
