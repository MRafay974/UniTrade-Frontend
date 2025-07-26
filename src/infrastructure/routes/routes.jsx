import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // 👈 import it

import Checkout from '../../components/Checkout/Checkout';
import Home from "../../ui/Home";
import Buy from "../../features/buy/Buy";
import Sell from "../../features/sell/Sell";
import AddProduct from "../../features/sell/AddProduct";
import ViewProductDetails from "../../features/product/VIewProduct";
import Browse from "../../ui/Browse";
import Cart from "../../features/product/Cart";
import Wishlist from "../../features/product/Wishlist";
import OrderHistory from "../../features/product/OrderHistory";
import AdminDashboard from "../../features/product/AdminDashboard";
import PaymentSuccess from "../../pages/PaymentSuccess";
import PaymentCancel from "../../pages/PaymentCancel";

export const routes = [
  { path: "/", element: <Navigate to="/login" replace /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/buy",
    element: (
      <ProtectedRoute>
        <Buy />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sell",
    element: (
      <ProtectedRoute>
        <Sell />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sell/add",
    element: (
      <ProtectedRoute>
        <AddProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sell/edit/:id",
    element: (
      <ProtectedRoute>
        <AddProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product/view/:id",
    element: (
      <ProtectedRoute>
        <ViewProductDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/browse",
    element: (
      <ProtectedRoute>
        <Browse />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/wishlist",
    element: (
      <ProtectedRoute>
        <Wishlist />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <OrderHistory />
      </ProtectedRoute>
    ),
  },
  {
    path:"/checkout",
    element:(
      <ProtectedRoute>
        <Checkout/>
      </ProtectedRoute>
    )
  },
  {
     path:"/payment-success",
    element:(
      <ProtectedRoute>
        <PaymentSuccess/>
      </ProtectedRoute>
    )

  },
  {

     path:"/payment-cancel",
    element:(
      <ProtectedRoute>
        <PaymentCancel/>
      </ProtectedRoute>
    )

  },

  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
];
