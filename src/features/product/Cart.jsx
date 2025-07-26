import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../apiInstances/axiosInstanceAuth";
import { handleError, handleSuccess } from "../../components/NavBar/utils";
import { FaShoppingCart, FaArrowRight, FaTrash } from "react-icons/fa";
import { ShoppingBag, Loader } from "lucide-react";
import { BACKEND_BASE_URL } from "../../apiInstances/baseurl";

// Memoized CartItem component
const CartItem = memo(({ item, onUpdateQuantity, onRemove, updatingQuantity }) => (
  <li className="p-6">
    <div className="flex items-center">
      <img
        src={`${BACKEND_BASE_URL}${item.product?.imageURL[0]}`}
        alt={item.product?.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-800">
          {item.product?.name}
        </h3>
        <p className="text-gray-500 mt-1">
          ${item.product?.price} per item
        </p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
            disabled={updatingQuantity || item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-gray-500 
            hover:text-gray-700 disabled:opacity-50 border rounded-full"
          >
            -
          </button>
          <span className="mx-4 min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
            disabled={updatingQuantity}
            className="w-8 h-8 flex items-center justify-center text-gray-500 
            hover:text-gray-700 disabled:opacity-50 border rounded-full"
          >
            +
          </button>
        </div>
      </div>
      <div className="ml-4 flex flex-col items-end">
        <span className="text-lg font-medium text-gray-800">
          ${(item.product?.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(item.product._id)}
          className="mt-2 text-red-500 hover:text-red-700 transition-colors p-2 
          hover:bg-red-50 rounded-full"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  </li>
));

CartItem.displayName = 'CartItem';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingQuantity, setUpdatingQuantity] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/cart/");
      setCart(data);
    } catch (err) {
      handleError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) return;
    setUpdatingQuantity(true);
    try {
      await axios.put("/cart/update", { productId, quantity });
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.map(item =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        )
      }));
     // handleSuccess("Quantity updated!");
    } catch {
      handleError("Failed to update quantity");
    } finally {
      setUpdatingQuantity(false);
    }
  }, []);

  const removeItem = useCallback(async (productId) => {
    try {
      await axios.delete("/cart/remove", { data: { productId } });
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.product._id !== productId)
      }));
      handleSuccess("Item removed from cart!");
    } catch {
      handleError("Failed to remove item");
    }
  }, []);

  // const handleCheckout = () => {
  //   if (!cart || cart.items.length === 0) {
  //     handleError("Your cart is empty");
  //     return;
  //   }

  //   console.log(cart.items)
  //   navigate("/checkout", { 
  //     state: { 
  //       cartItems: cart.items,
  //       totalAmount: calculateTotal()
  //     } 
  //   });
  // };



  const handleCheckout = () => {
  if (!cart || cart.items.length === 0) {
    handleError("Your cart is empty");
    return;
  }

  // Transform cart items to match the expected format
  const checkoutItems = cart.items.map(item => ({
    product: item.product,
    quantity: item.quantity,
    price: item.product.price * item.quantity
  }));

  navigate("/checkout", { 
    state: { 
      product: checkoutItems[0].product, // For single product checkout
      cartItems: checkoutItems,
      totalAmount: calculateTotal()
    } 
  });
};


  const calculateTotal = useCallback(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  }, [cart?.items]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything yet. Explore our products and start shopping!
          </p>
          <Link
            to="/buy"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold 
            rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Start Shopping
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <p className="text-sm text-gray-500 mt-1">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <ul className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <CartItem
                key={item.product?._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                updatingQuantity={updatingQuantity}
              />
            ))}
          </ul>

          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-800">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
              hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Proceed to Checkout
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;