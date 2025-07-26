import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ClipboardList } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-4">
          Thank you for your purchase! Your order has been confirmed and will be processed shortly.
        </p>

        {/* <div className="bg-green-50 rounded-lg p-4 mb-8">
          <p className="text-sm text-green-700">
            A confirmation email has been sent to your registered email address.
          </p>
        </div> */}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold
            hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            View Orders
          </button>

          <button
            onClick={() => navigate('/buy')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
            hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Browse More Products
          </button>

          <button
            onClick={() => navigate('/home')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold
            hover:bg-gray-200 transition-colors duration-200"
          >
            Return to Home
          </button>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team through the help center
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;