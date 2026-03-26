import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ]

  const handleNavClick = (href) => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">D</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900 hidden sm:inline">DiagnoOps</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 text-sm lg:text-base"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Join Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="bg-teal-600 text-white px-6 lg:px-8 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 shadow-md hover:shadow-lg text-sm lg:text-base">
              Join Patient
            </button>
            <button className="bg-gray-800 text-white px-6 lg:px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-900 transition duration-300 shadow-md hover:shadow-lg text-sm lg:text-base">
              Join Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition duration-300"
              aria-expanded="false"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-gray-700 hover:text-teal-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </a>
            ))}
            
            {/* Mobile Join Buttons */}
            <div className="px-3 py-2 space-y-2">
              <button className="w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 shadow-md text-base">
                Join Patient
              </button>
              <button className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-900 transition duration-300 shadow-md text-base">
                Join Admin
              </button>
            </div>

            {/* Mobile Login Link */}
            <a
              href="/login"
              className="text-teal-600 hover:text-teal-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              onClick={() => handleNavClick('/login')}
            >
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar