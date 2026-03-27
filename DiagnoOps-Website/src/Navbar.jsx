import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg border-b ${
        scrolled
          ? "bg-white/95 shadow-md border-teal-100"
          : "bg-white/90 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">

          {/* ✅ Logo (Increased Size) */}
          <a href="#home" className="flex items-center gap-3">
            <img
              src="/logo1.png"
              alt="DiagnoOps"
              className="h-12 w-auto md:h-14 object-contain"
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className="relative text-gray-600 font-medium text-sm hover:text-teal-700 transition"
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 ${
                    activeLink === link.label ? "w-full" : "w-0 hover:w-full"
                  }`}
                ></span>
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/join-platform" className="bg-gradient-to-r from-teal-600 to-teal-400 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-[1px] transition">
              Join Patient
            </Link>
            <Link to="/join-platform" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition">
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
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-700 py-2 px-3 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition"
              >
                <span className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"></span>
                {link.label}
              </a>
            ))}
          </div>

          <div className="my-3 h-[1px] bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>

          <div className="flex flex-col gap-2">
            <Link
              to="/join-platform"
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

          <a
            href="/login"
            className="block text-center text-teal-600 font-semibold mt-3 text-sm hover:underline"
          >
            Already have an account? Login →
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;