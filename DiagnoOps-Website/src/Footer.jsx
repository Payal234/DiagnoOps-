import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { MdMail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md'

const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateToHash = (hash) => {
    if (location.pathname !== '/') {
      navigate(`/#${hash}`)
      return
    }

    const target = document.getElementById(hash)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.hash = hash
    }
  }
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '#home', hash: 'home' },
        { label: 'About Us', href: '#about', hash: 'about' },
        { label: 'Services', href: '#services', hash: 'services' },
        { label: 'Contact', href: '#contact', hash: 'contact' },
      ]
    },
    {
      title: 'Platform',
      links: [
        { label: 'For Patients', href: '/platform' },
        { label: 'For Labs', href: '/platform' },
        { label: 'For Admins', href: '/platform' },
        { label: 'Pricing', href: '/platform' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/support' },
        { label: 'Documentation', href: '/support' },
        { label: 'Report Issue', href: '/support' },
        { label: 'FAQs', href: '/support' },
      ]
    },
  ]

  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', href: '#' },
    { icon: FaTwitter, label: 'Twitter', href: '#' },
    { icon: FaLinkedin, label: 'LinkedIn', href: '#' },
    { icon: FaInstagram, label: 'Instagram', href: '#' },
  ]

  const contactInfo = [
    { icon: MdPhone, label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MdMail, label: 'support@diagnoops.com', href: 'mailto:support@diagnoops.com' },
    { icon: MdLocationOn, label: '123 Healthcare Hub, Medical City, MC 12345', href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <h2 className="text-xl font-bold text-white">DiagnoOps</h2>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Making healthcare accessible and convenient for everyone. Your trusted platform for diagnostic services.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-3 text-gray-400 hover:text-teal-400 transition duration-300 text-sm"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-teal-400" />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.hash ? (
                      <button
                        onClick={() => navigateToHash(link.hash)}
                        className="text-left text-gray-400 hover:text-teal-400 transition duration-300 text-sm"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-teal-400 transition duration-300 text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold text-sm md:text-base mb-4">
                Follow Us
              </h4>
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-teal-600 hover:text-white transition duration-300"
                      title={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Legal Links */}
            <div className="md:text-right">
              <h4 className="text-white font-semibold text-sm md:text-base mb-4">
                Legal
              </h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:justify-end text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-teal-400 transition duration-300">
                  Privacy Policy
                </a>
                <span className="hidden sm:inline text-gray-600">•</span>
                <a href="/terms" className="text-gray-400 hover:text-teal-400 transition duration-300">
                  Terms of Service
                </a>
                <span className="hidden sm:inline text-gray-600">•</span>
                <a href="/cookies" className="text-gray-400 hover:text-teal-400 transition duration-300">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 md:pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {/* Operating Hours */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Operating Hours</h4>
              <p className="text-gray-400 text-sm">
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Certifications</h4>
              <p className="text-gray-400 text-sm">
                ISO 27001 Certified<br />
                HIPAA Compliant<br />
                GDPR Compliant
              </p>
            </div>

            {/* Emergency Support */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">24/7 Support</h4>
              <p className="text-gray-400 text-sm">
                Emergency: +1 (555) 999-0000<br />
                Email: support@diagnoops.com
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">
              &copy; 2026 DiagnoOps. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Designed and Developed by <span className="font-semibold text-cyan-400 hover:text-teal-600 cursor-pointer">Payal Ramkrishna Dhobale.</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button (sticky) */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:block">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl transition duration-300 opacity-0 hover:opacity-100 hover:flex"
          title="Scroll to top"
        >
          ↑
        </button>
      </div>
    </footer>
  )
}

export default Footer