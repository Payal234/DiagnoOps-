import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell } from "lucide-react";
import { CartContext } from "../context/CartContext";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const pageTitles = {
    "/": "Dashboard",
    "/tests": "Tests & Packages",
    "/bookings": "My Bookings",
    "/reports": "Reports",
    "/notifications": "Notifications",
    "/profile": "Profile",
    "/cart": "My Cart",
  };

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="sticky top-0 z-20 w-full bg-gray-100 px-6 py-4 flex items-center justify-between border-b">
      
      {/* Left Side - Page Title */}
      <h1 className="text-xl font-semibold text-gray-700">
        {currentTitle}
      </h1>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6">

        {/* Cart Icon */}
        <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
          <ShoppingCart
            size={22}
            className="text-gray-600 hover:text-black"
          />

          {/* Cart Count Badge */}
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* Notification Icon */}
        <Bell
          size={22}
          onClick={() => navigate("/notifications")}
          className="cursor-pointer text-gray-600 hover:text-black"
        />

      </div>
    </div>
  );
};

export default Topbar;