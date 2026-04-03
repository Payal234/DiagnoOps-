import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/#home" },
    { label: "About", to: "/#about" },
    { label: "Services", to: "/#services" },
    { label: "Contact", to: "/#contact" },
  ];

  const handleNavClick = (link) => (e) => {
    e.preventDefault();
    setActiveLink(link.label);

    if (location.pathname !== "/") {
      navigate(link.to);
      setIsOpen(false);
      return;
    }

    const hash = link.to.split("#")[1];
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = hash;
      }
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  }, [location.pathname, location.hash]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg ${
        scrolled
          ? "bg-white/95 shadow-md"
          : "bg-white/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">

          {/* ✅ TEXT LOGO */}
          <Link
            to="/#home"
            className="flex flex-col leading-tight"
            onClick={() => setActiveLink("Home")}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              DiagnoOps
            </span>
            <span className="text-xs text-gray-500 tracking-wide">
              Lab Platform
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={handleNavClick(link)}
                className="relative text-gray-600 font-medium text-sm hover:text-teal-700 transition"
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 ${
                    activeLink === link.label ? "w-full" : "w-0 hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/join-patient"
              className="bg-gradient-to-r from-teal-600 to-teal-400 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-[1px] transition"
            >
              Join Patient
            </Link>
            <Link
              to="/join-platform"
              className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
            >
              Join Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 border border-teal-200 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`h-[2px] w-5 bg-teal-700 transition ${
                isOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 bg-teal-700 transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 bg-teal-700 transition ${
                isOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 border-t border-teal-100">
          <div className="flex flex-col gap-2 mt-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={handleNavClick(link)}
                className="flex items-center gap-2 text-gray-700 py-2 px-3 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition"
              >
                <span className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"></span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="my-3 h-[1px] bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>

          <div className="flex flex-col gap-2">
            <Link
              to="/join-patient"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-gradient-to-r from-teal-600 to-teal-400 text-white py-2 rounded-lg font-semibold shadow-md"
            >
              Join Patient
            </Link>
            <Link
              to="/join-platform"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              Join Admin
            </Link>
          </div>

          {/* <a
            href="/login"
            className="block text-center text-teal-600 font-semibold mt-3 text-sm hover:underline"
          >
            Already have an account? Login →
          </a> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;