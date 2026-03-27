import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Users, MapPin, Clock, Shield, TrendingUp, MapPinIcon, PhoneIcon } from 'lucide-react'

const Home = () => {
  const [showAllLabs, setShowAllLabs] = useState(false)
  const [labsData, setLabsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_BASE = "http://localhost:5000"

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await fetch(`${API_BASE}/api/labadmin/public`)
        const contentType = res.headers.get("content-type") || ""

        if (!contentType.includes("application/json")) {
          const text = await res.text()
          throw new Error(
            `Expected JSON from API but got ${contentType || "unknown"}. ` +
              `Is backend running on ${API_BASE}?`
          )
        }

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.message || "Failed to load labs")
        }

        const labs = Array.isArray(data?.labs) ? data.labs : []
        setLabsData(labs)
      } catch (e) {
        setError(e?.message || "Failed to load labs")
        console.error("Error fetching labs:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchLabs()
  }, [])

  const displayedLabs = showAllLabs ? labsData : labsData.slice(0, 4)
  return (
    <div className="w-full bg-white">
      {/* ==================== HERO SECTION ==================== */}
      <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-br from-teal-50 to-blue-50" id="home">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Your Health,
                <span className="text-teal-600"> Our Priority</span>
              </h1>

              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
                Find trusted diagnostic labs, book medical tests online, and manage your health records all in one place. DiagnoOps makes healthcare accessible and convenient.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl">
                  Explore Labs
                </button>
                <button className="bg-white text-teal-600 border-2 border-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition duration-300">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 md:pt-12">
                <div className="text-center md:text-left">
                  <p className="text-2xl md:text-3xl font-bold text-teal-600">500+</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Labs Across Cities</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl md:text-3xl font-bold text-teal-600">1000+</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Medical Tests</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl md:text-3xl font-bold text-teal-600">50K+</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Happy Users</p>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="flex justify-center md:justify-end pt-8 md:pt-0">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="bg-gradient-to-br from-teal-400 to-blue-400 rounded-2xl lg:rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-xl p-6 space-y-4">
                    <div className="h-3 bg-teal-200 rounded w-3/4"></div>
                    <div className="h-3 bg-teal-100 rounded w-full"></div>
                    <div className="h-3 bg-teal-100 rounded w-5/6"></div>
                    <div className="pt-4 border-t border-gray-200 mt-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section className="py-12 md:py-20 bg-gray-50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900">
                About DiagnoOps
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                DiagnoOps is revolutionizing healthcare by making diagnostic services accessible, affordable, and convenient for everyone. We connect patients with trusted laboratories and provide a seamless platform for booking tests and managing health records.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                With over 500+ partner labs and 1000+ medical tests, we serve more than 50,000 satisfied customers across India. Our mission is to make healthcare accessible to all.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-teal-600">500+</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Partner Labs</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-teal-600">1000+</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Medical Tests</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-teal-600">50K+</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Happy Users</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-teal-600">24/7</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Support</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl p-8 shadow-lg">
                <div className="bg-white rounded-xl p-8 text-center space-y-4">
                  <div className="text-5xl mb-4">🏥</div>
                  <p className="text-gray-700 font-semibold">Professional Diagnostics</p>
                  <p className="text-gray-500 text-sm">Trusted by thousands for accurate results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DiagnoOps?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Experience healthcare management like never before with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-teal-50 to-transparent p-6 md:p-8 rounded-2xl border border-teal-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-600 rounded-full mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Find Labs Near You</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Locate diagnostic centers in your area with real-time availability and ratings
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-transparent p-6 md:p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Easy Booking</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Book tests online and choose your preferred time slots in just a few clicks
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-transparent p-6 md:p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Secure Records</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Your health data is encrypted and securely stored with HIPAA compliance
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-transparent p-6 md:p-8 rounded-2xl border border-green-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Health Insights</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Get detailed reports and track your health trends over time
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-orange-50 to-transparent p-6 md:p-8 rounded-2xl border border-orange-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Fast Results</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Get test results instantly in your digital locker without delays
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-red-50 to-transparent p-6 md:p-8 rounded-2xl border border-red-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Expert Support</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                24/7 customer support from qualified healthcare professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How DiagnoOps Works
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Simple steps to manage your health better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="bg-teal-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Search Labs</h3>
              <p className="text-gray-600 text-sm">Browse and find diagnostic centers near you</p>
              {/* Connector line (hidden on mobile) */}
              <div className="hidden md:block absolute top-7 left-full w-full h-1 bg-teal-200" style={{ marginLeft: '2rem', marginRight: '-2rem', width: 'calc(100% + 4rem)' }}></div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="bg-teal-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Select Tests</h3>
              <p className="text-gray-600 text-sm">Choose from 1000+ available medical tests</p>
              <div className="hidden md:block absolute top-7 left-full w-full h-1 bg-teal-200" style={{ marginLeft: '2rem', marginRight: '-2rem', width: 'calc(100% + 4rem)' }}></div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="bg-teal-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Book Appointment</h3>
              <p className="text-gray-600 text-sm">Select your preferred time and location</p>
              <div className="hidden md:block absolute top-7 left-full w-full h-1 bg-teal-200" style={{ marginLeft: '2rem', marginRight: '-2rem', width: 'calc(100% + 4rem)' }}></div>
            </div>

            {/* Step 4 */}
            <div className="relative text-center">
              <div className="bg-teal-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Get Results</h3>
              <p className="text-gray-600 text-sm">Receive results digitally and consult experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Join thousands of satisfied customers using DiagnoOps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-transparent p-6 md:p-8 rounded-xl border border-blue-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                "DiagnoOps made booking my lab tests incredibly easy. The results came faster than expected, and the entire process was seamless."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Rahul Kumar</p>
                  <p className="text-gray-600 text-xs">Mumbai, India</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-teal-50 to-transparent p-6 md:p-8 rounded-xl border border-teal-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                "The app is user-friendly and I appreciate the detailed health reports. It's like having a personal health assistant."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Priya Sharma</p>
                  <p className="text-gray-600 text-xs">Bangalore, India</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-green-50 to-transparent p-6 md:p-8 rounded-xl border border-green-100 hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                "Highly recommended! The 24/7 support team was extremely helpful when I had questions about my test results."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Amit Patel</p>
                  <p className="text-gray-600 text-xs">Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES SECTION - LABS ==================== */}
      <section className="py-12 md:py-20 bg-gray-50" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your Nearby Labs
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Explore our network of trusted diagnostic centers across India
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading labs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          )}

          {/* Labs Grid - 4 Cards per Row */}
          {!loading && !error && labsData.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {displayedLabs.map((lab) => (
                  <div key={lab._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200">
                    {/* Lab Header with Image */}
                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-8 text-center overflow-hidden h-48">
                      {lab.labPhoto ? (
                        <img
                          src={lab.labPhoto}
                          alt={lab.labName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl flex items-center justify-center h-full">🏥</div>
                      )}
                    </div>

                    {/* Lab Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">{lab.labName}</h3>
                      
                      {/* Owner Name */}
                      <div className="flex items-start gap-2 text-gray-600 text-sm">
                        <span>👤</span>
                        <span>{lab.ownerName || "N/A"}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal-600" />
                        <span>{lab.address || "—"}</span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span>{lab.openingTime || "—"} - {lab.closingTime || "—"}</span>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span>📅</span>
                        <span>{lab.experience === 0 || lab.experience ? `${lab.experience} years` : "—"}</span>
                      </div>

                      {/* View Button */}
                      <button className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 mt-4">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* See All Button */}
              {!showAllLabs && labsData.length > 4 && (
                <div className="text-center mt-10 md:mt-14">
                  <button
                    onClick={() => setShowAllLabs(true)}
                    className="bg-teal-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    See All Labs ({labsData.length})
                  </button>
                </div>
              )}

              {/* Show Less Button */}
              {showAllLabs && (
                <div className="text-center mt-10 md:mt-14">
                  <button
                    onClick={() => setShowAllLabs(false)}
                    className="bg-gray-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    Show Less
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Labs State */}
          {!loading && !error && labsData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No labs available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section className="py-12 md:py-20 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 mb-4">
                  Get In Touch
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Have questions? We're here to help! Contact our team for any inquiries about our services.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-xs">Available 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">support@diagnoops.com</p>
                    <p className="text-gray-500 text-xs">We'll reply within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600 text-sm">123 Healthcare Hub</p>
                    <p className="text-gray-600 text-sm">Medical City, MC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">Message</label>
                  <textarea
                    rows="4"
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-teal-100 text-sm sm:text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who have already made the switch to DiagnoOps for better health management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl">
              Get Started Now
            </button>
            <button className="bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-800 transition duration-300 border border-white border-opacity-20">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>  
    </div>
  )
}

export default Home