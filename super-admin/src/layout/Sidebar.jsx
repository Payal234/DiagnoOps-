import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars ,FaTimes, FaThLarge, FaClipboardList, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: <FaThLarge size={15} /> },
  { to: "/lab", label: "Lab Application", icon: <FaClipboardList size={15} /> },
  
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("superAdmin");
    close();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile & Tablet Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0f172a] text-white shadow-md">
        <h1 className="text-lg font-bold tracking-wide">Admin Panel</h1>
        <button
  onClick={() => setOpen(!open)}
  aria-label="Toggle menu"
  className="p-2 rounded hover:bg-white/10 transition"
>
  <FaBars size={20} />
</button>
      </header>

      {/* Overlay (mobile/tablet only) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-[#0f172a] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-wide">Super Admin Panel</h2>
          <button
            onClick={close}
            className="md:hidden p-1 rounded hover:bg-white/10 transition"
            aria-label="Close menu"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1  px-4 py-5 space-y-1">
          {navLinks.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={close}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-teal-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="opacity-80">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <FaSignOutAlt size={15} className="opacity-80" />
            Logout
          </button>
        </div>
      </aside>

      {/* Top spacer for mobile so content isn't hidden under header */}
      <div className="md:hidden h-14" />
    </>
  );
};

export default Sidebar;