import React, { useState, useEffect, useContext } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  CalendarCheck,
  FileText,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ShoppingCart
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Available Labs", icon: FlaskConical, path: "/Labs" },
  { name: "My Bookings", icon: CalendarCheck, path: "/bookings" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "Notifications", icon: Bell, path: "/notifications" },
  { name: "Profile", icon: User, path: "/profile" },
];

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);

  // Sync active menu with route
  useEffect(() => {
    const match = menuItems.find(
      (item) => item.path === location.pathname
    );
    if (match) setActive(match.name);
  }, [location.pathname]);

  // Get logged-in user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        // if it's not JSON just use the string
        setUser(stored);
      }
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* ✅ MOBILE TOPBAR */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#0f172a] text-white px-4 py-4 flex items-center justify-between z-50">
        
        {/* Left Title */}
        <h1 className="text-lg font-semibold text-teal-400">
          DiagnoOps
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-lg hover:bg-slate-800 transition"
            title="Cart"
          >
            <ShoppingCart size={22} className="text-white" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>

          <button onClick={() => setOpen(!open)} className="cursor-pointer p-2 rounded-lg hover:bg-slate-800 transition">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ✅ Overlay (Mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <div
        className={`fixed lg:sticky 
        top-16 lg:top-0 left-0
        h-[calc(100vh-64px)] lg:h-screen 
        w-[min(19rem,85vw)] 
        bg-[#0f172a] text-gray-300 
        flex flex-col
        transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >

        {/* Desktop Logo */}
        <div className="hidden lg:block p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-teal-400">
            DiagnoOps
          </h1>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-4 cursor-pointer">
          <ul className="space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setActive(item.name);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    active === item.name
                      ? "bg-slate-700 text-teal-400"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom User + Logout */}
        {user && (
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold uppercase">
                  {user.name?.charAt(0)}
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-slate-700 transition"
                title="Logout"
              >
                <LogOut
                  size={18}
                  className="text-red-400 hover:text-red-500"
                />
              </button>

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Sidebar;