import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Tag, 
  MapPin, 
  Calendar, 
  Shield,
  CreditCard
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../../apiInstances/axiosInstanceAuth";
import { handleSuccess, handleError } from "../../components/NavBar/utils";
import { BACKEND_BASE_URL } from "../../apiInstances/baseurl";




const ViewProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { product } = location.state || {};
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#131727] to-[#1a2236] text-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-md mx-auto">
                        <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
                        <p className="text-gray-300 mb-8">
                            The product you're looking for doesn't exist or has been removed.
                        </p>
                        <button
                            onClick={() => navigate("/buy")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl 
                            hover:bg-blue-700 transition-all duration-300"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatPrice = (price) => price ? `$${parseFloat(price).toFixed(2)}` : "N/A";
    const hasSale = product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price);

    const getPostedTime = (createdAt) => {
        if (!createdAt) return "Recently posted";
        const postedDate = new Date(createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - postedDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Posted today";
        if (diffDays === 1) return "Posted yesterday";
        return `Posted ${diffDays} days ago`;
    };

   
  const handleAddToCart = async () => {
    try {
      await axios.post("/cart/add", { productId: product._id, quantity: 1 });
      handleSuccess("Added to cart!");
    } catch {
      handleError("Failed to add to cart");
    }
  };

    const handleBuyNow = async () => {
        setIsBuying(true);
        try {
            navigate("/checkout", { state: { product } });
        } catch (error) {
            toast.error("Failed to process purchase");
        } finally {
            setIsBuying(false);
        }
    };

   const toggleWishlist = async () => {
  try {
    if (!isInWishlist) {
      // Add to wishlist
      setIsInWishlist(true);
      await axios.post("/wishlist/add", { productId: product._id });
      handleSuccess("Added to wishlist!");
    } else {
      // Remove from wishlist
      setIsInWishlist(false);
      await axios.delete("/wishlist/remove", { data: { productId: product._id } });
      handleSuccess("Removed from wishlist!");
    }
  } catch {
    handleError("Failed to update wishlist");
  }
};

    // const toggleWishlist = () => {
    //     setIsInWishlist(!isInWishlist);
    //     toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
    // };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#131727] to-[#1a2236]">
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-white/80 hover:text-white 
                    transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Marketplace
                </button>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 
                        backdrop-blur-sm shadow-xl">
                            <img
                                src={`${BACKEND_BASE_URL}${product.imageURL[selectedImageIndex]}`}
                                alt={product.name}
                                className="w-full h-full object-contain transform 
                                transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {product.imageURL.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative aspect-square rounded-xl overflow-hidden 
                                    ${selectedImageIndex === index 
                                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#131727]' 
                                        : 'hover:opacity-80'}`}
                                >
                                    <img
                                        src={`${BACKEND_BASE_URL}${img}`}
                                        alt={`${product.name} - View ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {getPostedTime(product.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {product.location || "Engineering Building"}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleWishlist}
                                    className={`p-3 rounded-full transition-all duration-300 
                                    ${isInWishlist 
                                        ? 'bg-pink-500/20 text-pink-500' 
                                        : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                >
                                    <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-3xl font-bold text-white">
                                        {formatPrice(product.price)}
                                    </span>
                                    {hasSale && (
                                        <span className="text-lg line-through text-gray-400">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <Shield className="w-4 h-4" />
                                        <span>University Marketplace Guarantee</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <Tag className="w-4 h-4" />
                                        <span>Category: {product.category || "General"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Secure University Payment</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl 
                                    font-semibold hover:bg-blue-700 transition-all duration-300 
                                    flex items-center justify-center gap-2 disabled:opacity-50 
                                    disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isBuying}
                                    className="w-full px-6 py-3 bg-green-600 text-white rounded-xl 
                                    font-semibold hover:bg-green-700 transition-all duration-300
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isBuying ? "Processing..." : "Buy Now"}
                                </button>
                            </div>

                            {/* Product Description */}
                            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm mt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Product Details
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {product.description || "No description available."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProductDetails;