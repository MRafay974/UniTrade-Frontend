import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    CreditCard, 
    MapPin, 
    Loader, 
    AlertCircle, 
    Banknote, 
    ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { loadStripe } from "@stripe/stripe-js";
import { BACKEND_BASE_URL } from "../../apiInstances/baseurl";

const stripePromise = loadStripe("pk_test_51RoOQJ4DaJCyFJBaDJ1YNYOBsBsyLTGaLLLuUsF4hKjZfC7RqvhmA6eq6xn0TRxtr7L4GzTDfkxTupnqkjzNHl1w00J8vQep1U");

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        paymentMethod: '',
        pickupLocation: ''
    });

    // ✅ Fetch user profile with Authorization header
    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (!token) {
            toast.error('Please login to continue');
            navigate('/login', { 
                state: { 
                    from: location.pathname,
                    product: product 
                }
            });
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BACKEND_BASE_URL}/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data) {
                    setUserData(response.data);
                }
            } catch (error) {
                console.error("User Profile Error:", error.response?.data || error.message);
                if (error.response?.status === 401) {
                    localStorage.removeItem('Token');
                    navigate('/login');
                }
                toast.error('Failed to load user data');
            } finally {
                setPageLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, location.pathname, product]);

    const handleSubmit = async () => {
        if (!formData.paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        if (formData.paymentMethod === "cash" && !formData.pickupLocation) {
            toast.error("Please provide a pickup location for cash on delivery");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('Token');
            if (!token) {
                toast.error("Please log in again");
                navigate('/login');
                return;
            }

            if (formData.paymentMethod === "card") {
                const stripe = await stripePromise;

                console.log("Creating Stripe session...");

                const { data } = await axios.post(`${BACKEND_BASE_URL}/checkout/create-checkout-session`, {
                    product: {
                        name: product.name,
                        price: product.price,
                        imageURL: product.imageURL,
                        _id: product._id,
                        userEmail: product.userEmail
                    },
                    userId: userData._id,
                    buyerName: userData.name,
                    buyerPhone: userData.phone
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Stripe session created:", data);

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    toast.error("Failed to get Stripe payment URL");
                }

            } else {
                // ✅ Cash on Delivery: Save order in DB
                console.log("Placing Cash on Delivery order...");
                const orderData = {
                    productId: product._id,
                    amount: product.price,
                    pickupLocation: formData.pickupLocation || "",
                    paymentMethod: formData.paymentMethod,
                    sellerEmail: product.userEmail
                };

                const response = await axios.post(`${BACKEND_BASE_URL}/order/place`, orderData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    toast.success("Order placed successfully!");
                    setTimeout(() => navigate("/orders"), 1500);
                } else {
                    toast.error(response.data.message || "Failed to place order");
                }
            }
        } catch (error) {
            console.error("Order Error:", error.response?.data || error.message);
            toast.error("Failed to process payment");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">No Product Selected</h1>
                    <p className="text-gray-600 mt-2">Please select a product to checkout</p>
                    <button
                        onClick={() => navigate('/buy')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-3"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4 flex-1">
                {/* Order Summary */}
                <div className="flex items-center gap-4 bg-blue-50 p-3 rounded-lg">
                    <img
                        src={`${BACKEND_BASE_URL}${product.imageURL[0]}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-500">University Marketplace</p>
                    </div>
                    <span className="text-green-600 font-bold text-lg">${product.price}</span>
                </div>

                {/* Payment Method */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Payment Method</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'cash', label: 'Cash on Delivery', icon: Banknote },
                            { id: 'card', label: 'Card Payment', icon: CreditCard }
                        ].map(method => (
                            <label
                                key={method.id}
                                className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition 
                                    ${formData.paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={formData.paymentMethod === method.id}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        paymentMethod: e.target.value
                                    }))}
                                    className="hidden"
                                />
                                <method.icon className={`w-6 h-6 mb-1 ${formData.paymentMethod === method.id ? 'text-blue-600' : 'text-gray-500'}`} />
                                <span className="text-xs font-medium text-center">{method.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Pickup Location (Only for Cash) */}
                {formData.paymentMethod === 'cash' && (
                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 mb-1">Pickup Location</h2>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={formData.pickupLocation}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    pickupLocation: e.target.value
                                }))}
                                placeholder="e.g., Library, Student Center"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Place Order Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.paymentMethod || (formData.paymentMethod === 'cash' && !formData.pickupLocation)}
                    className="w-full bg-blue-600 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <Loader className="w-5 h-5 mr-2 animate-spin" /> Processing...
                        </div>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
