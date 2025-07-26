import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "./utils";

export default function Navbar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("UserLoggedIn");
    localStorage.removeItem("UserEmail"); // Clear email for admin detection
    handleSuccess("Successfully Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const linkClasses = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      : "text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors";

  const userEmail = localStorage.getItem("UserEmail");
  const isAdmin = userEmail === "admin@admin.com";

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">
                Welcome, {localStorage.getItem("UserLoggedIn") || "Guest"}
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/home" className={linkClasses("/home")}>
                Home
              </Link>
              <Link to="/buy" className={linkClasses("/buy")}>
                Buy
              </Link>
              <Link to="/sell/add" className={linkClasses("/sell/add")}>
                Sell
              </Link>
              <Link to="/cart" className={linkClasses("/cart")}>
                Cart
              </Link>
              <Link to="/wishlist" className={linkClasses("/wishlist")}>
                Wishlist
              </Link>
              <Link to="/orders" className={linkClasses("/orders")}>
                Orders
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={linkClasses("/admin/dashboard")}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ml-2"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowSidebar(true)}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-300 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-2">
          <Link
            to="/home"
            onClick={() => setShowSidebar(false)}
            className={linkClasses("/home")}
          >
            Home
          </Link>
          <Link
            to="/buy"
            onClick={() => setShowSidebar(false)}
            className={linkClasses("/buy")}
          >
            Buy
          </Link>
          <Link
            to="/sell/add"
            onClick={() => setShowSidebar(false)}
            className={linkClasses("/sell/add")}
          >
            Sell
          </Link>
          <Link
            to="/cart"
            onClick={() => setShowSidebar(false)}
            className={linkClasses("/cart")}
          >
            Cart
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setShowSidebar(false)}
            className={linkClasses("/wishlist")}
          >
            Wishlist
          </Link>
          <Link
            to="/orders"
            onClick={() => setShowSidebar(false)}
            className={linkClasses("/orders")}
          >
            Orders
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setShowSidebar(false)}
              className={linkClasses("/admin/dashboard")}
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => {
              setShowSidebar(false);
              handleLogout();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-left mt-4"
          >
            Logout
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
