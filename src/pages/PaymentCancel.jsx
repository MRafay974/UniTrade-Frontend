import { useNavigate } from 'react-router-dom';
import { XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your payment was not completed. Don't worry, you can try again or browse other products.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/buy')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
            hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Browse Products
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold
            hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;