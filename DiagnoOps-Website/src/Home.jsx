import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Users, MapPin, Clock, Shield, TrendingUp, MapPinIcon, PhoneIcon, ArrowRight, ChevronDown, Star } from 'lucide-react'

/* ── Fires once when element enters viewport ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── Animated counter ── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, visible] = useInView()
  useEffect(() => {
    if (!visible) return
    const num = parseInt(target.replace(/\D/g, ''))
    let cur = 0
    const step = Math.ceil(num / 60)
    const timer = setInterval(() => {
      cur += step
      if (cur >= num) { setCount(num); clearInterval(timer) }
      else setCount(cur)
    }, 24)
    return () => clearInterval(timer)
  }, [visible, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Fade-in wrapper ── */
const FadeIn = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const [ref, visible] = useInView()
  const transforms = {
    up:    'translateY(36px)',
    down:  'translateY(-36px)',
    left:  'translateX(-36px)',
    right: 'translateX(36px)',
    none:  'none',
  }
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translate(0,0)' : transforms[direction],
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ */

const Home = () => {
  const [showAllLabs, setShowAllLabs] = useState(false)
  const [labsData, setLabsData]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const API_BASE = 'http://localhost:5000'

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true); setError('')
        const res = await fetch(`${API_BASE}/api/labadmin/public`)
        const ct  = res.headers.get('content-type') || ''
        if (!ct.includes('application/json'))
          throw new Error(`Expected JSON. Is backend running on ${API_BASE}?`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to load labs')
        setLabsData(Array.isArray(data?.labs) ? data.labs : [])
      } catch (e) {
        setError(e?.message || 'Failed to load labs')
      } finally {
        setLoading(false)
      }
    }
    fetchLabs()
  }, [])

  const displayedLabs = showAllLabs ? labsData : labsData.slice(0, 4)

  const features = [
    { icon: MapPin,      title: 'Find Labs Near You', desc: 'Locate diagnostic centers in your area with real-time availability and ratings.',   accent: 'teal'    },
    { icon: Clock,       title: 'Easy Booking',        desc: 'Book tests online and choose your preferred time slots in just a few clicks.',       accent: 'sky'     },
    { icon: Shield,      title: 'Secure Records',      desc: 'Your health data is encrypted and securely stored with HIPAA compliance.',           accent: 'violet'  },
    { icon: TrendingUp,  title: 'Health Insights',     desc: 'Get detailed reports and track your health trends over time.',                       accent: 'emerald' },
    { icon: Zap,         title: 'Fast Results',        desc: 'Get test results instantly in your digital locker without delays.',                  accent: 'amber'   },
    { icon: Users,       title: 'Expert Support',      desc: '24/7 customer support from qualified healthcare professionals.',                     accent: 'rose'    },
  ]
  const accentMap = {
    teal:    { bg: 'bg-teal-50',    icon: 'bg-teal-500',    border: 'border-teal-100',    shadow: 'hover:shadow-teal-100'    },
    sky:     { bg: 'bg-sky-50',     icon: 'bg-sky-500',     border: 'border-sky-100',     shadow: 'hover:shadow-sky-100'     },
    violet:  { bg: 'bg-violet-50',  icon: 'bg-violet-500',  border: 'border-violet-100',  shadow: 'hover:shadow-violet-100'  },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', border: 'border-emerald-100', shadow: 'hover:shadow-emerald-100' },
    amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-500',   border: 'border-amber-100',   shadow: 'hover:shadow-amber-100'   },
    rose:    { bg: 'bg-rose-50',    icon: 'bg-rose-500',    border: 'border-rose-100',    shadow: 'hover:shadow-rose-100'    },
  }

  const steps = [
    { n: '01', title: 'Search Labs',      desc: 'Browse and find diagnostic centers near you'          },
    { n: '02', title: 'Select Tests',     desc: 'Choose from 1000+ available medical tests'            },
    { n: '03', title: 'Book Appointment', desc: 'Select your preferred time and location'              },
    { n: '04', title: 'Get Results',      desc: 'Receive results digitally and consult experts'        },
  ]

  const testimonials = [
    { quote: 'DiagnoOps made booking my lab tests incredibly easy. The results came faster than expected, and the entire process was seamless.',        name: 'Rahul Kumar',  loc: 'Mumbai, India',    grad: 'from-teal-400 to-cyan-400'   },
    { quote: 'The app is user-friendly and I appreciate the detailed health reports. It\'s like having a personal health assistant.',                   name: 'Priya Sharma', loc: 'Bangalore, India', grad: 'from-violet-400 to-pink-400'  },
    { quote: 'Highly recommended! The 24/7 support team was extremely helpful when I had questions about my test results.',                             name: 'Amit Patel',   loc: 'Delhi, India',     grad: 'from-orange-400 to-rose-400'  },
  ]

  return (
    <div className="w-full bg-white overflow-x-hidden cursor-pointer">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center bg-white overflow-hidden -top-15">

        {/* Animated ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-teal-50 via-cyan-50 to-transparent rounded-full blur-3xl opacity-70 animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-sky-100 to-transparent rounded-full blur-3xl opacity-50 animate-pulse"
            style={{ animationDuration: '9s', animationDelay: '2s' }}
          />
          {/* Subtle dot grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#0d9488" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── Left text ── */}
            <div className="space-y-8 text-center lg:text-left">

              <FadeIn delay={0.05}>
                <span className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                  Trusted Healthcare Platform
                </span>
              </FadeIn>

              <FadeIn delay={0.15}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900">
                  Your Health,
                  <br />
                  <span className="relative inline-block text-teal-600">
                    Our Priority
                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 340 12" fill="none">
                      <path d="M2 10 Q85 2 170 8 Q255 14 338 5" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.35" />
                    </svg>
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.25}>
                <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Find trusted diagnostic labs, book medical tests online, and manage your health records all in one place. DiagnoOps makes healthcare accessible and convenient.
                </p>
              </FadeIn>

              <FadeIn delay={0.35}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="#services"
                    className="group inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-teal-200 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Explore Labs
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#about"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-teal-300 text-gray-700 hover:text-teal-700 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Learn More
                  </a>
                </div>
              </FadeIn>

              {/* Animated stats */}
              <FadeIn delay={0.45}>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                  {[
                    { val: '500+',  sfx: '+', label: 'Labs Across Cities' },
                    { val: '1000+', sfx: '+', label: 'Medical Tests'      },
                    { val: '50',    sfx: 'K+',label: 'Happy Users'        },
                  ].map(({ val, sfx, label }) => (
                    <div key={label} className="text-center lg:text-left">
                      <p className="text-2xl sm:text-3xl font-black text-teal-600">
                        <Counter target={val} suffix={sfx} />
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* ── Right video ── */}
            <FadeIn delay={0.2} direction="left" className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Slow spinning dashed ring */}
                <div
                  className="absolute -inset-6 rounded-full border-2 border-dashed border-teal-200 opacity-50 animate-spin"
                  style={{ animationDuration: '22s' }}
                />
                {/* Glow blob behind */}
                <div className="absolute inset-0 rounded-3xl bg-teal-400 opacity-10 blur-2xl scale-110" />

                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-100 ring-1 ring-teal-100">
                  <video
                    src="/Hero_v.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/10 to-transparent pointer-events-none" />
                </div>

                {/* Floating toast */}
                <div className="absolute -bottom-5 -left-5 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Test Booked!</p>
                    <p className="text-xs text-gray-400">2 mins ago</p>
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs text-gray-400 tracking-widest uppercase">scroll</span>
          <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
        </div>
      </section>

      {/* ══════════════════════════════════
          ABOUT
      ══════════════════════════════════ */}
      <section id="about" className="py-4 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Image */}
            <FadeIn direction="right" className="relative flex justify-center order-2 lg:order-1">
              <div className="absolute -inset-5 bg-teal-100 rounded-3xl rotate-3 opacity-30" />
              <div className="absolute -inset-5 bg-cyan-100 rounded-3xl -rotate-2 opacity-25" />
              <div className="relative z-10 bg-white rounded-2xl overflow-hidden shadow-2xl border border-white w-full max-w-sm sm:max-w-md">
                <img
                  src="/about.png"
                  alt="About DiagnoOps"
                  className="w-full h-64 sm:h-80 md:h-96 object-contain p-4"
                />
              </div>
              {/* Floating stat bubble */}
              <div className="absolute -top-4 -right-4 bg-teal-600 text-white rounded-2xl px-5 py-3 shadow-xl z-20">
                <p className="text-2xl font-black">24/7</p>
                <p className="text-teal-200 text-xs font-medium">Support</p>
              </div>
            </FadeIn>

            {/* Text */}
            <div className="space-y-8 text-center lg:text-left order-1 lg:order-2">
              <FadeIn delay={0.1}>
                <span className="inline-block bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
                  Who We Are
                </span>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  About <span className="text-teal-600">DiagnoOps</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="space-y-4 text-gray-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                  <p>DiagnoOps is revolutionizing healthcare by making diagnostic services accessible, affordable, and convenient for everyone. We connect patients with trusted laboratories and provide a seamless platform for booking tests and managing health records.</p>
                  <p>With over 500+ partner labs and 1000+ medical tests, we serve more than 50,000 satisfied customers across India. Our mission is to make healthcare accessible to all.</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
                  {[['500+', 'Partner Labs'], ['1000+', 'Medical Tests'], ['50K+', 'Happy Users'], ['24/7', 'Support']].map(([v, l]) => (
                    <div key={l} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center lg:text-left">
                      <p className="text-xl font-black text-teal-600">{v}</p>
                      <p className="text-gray-400 text-xs mt-1">{l}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES
      ══════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Why DiagnoOps
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Why Choose <span className="text-teal-600">DiagnoOps?</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              Experience healthcare management like never before with our comprehensive platform
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, accent }, i) => {
              const a = accentMap[accent]
              return (
                <FadeIn key={title} delay={i * 0.08} direction="up">
                  <div className={`group p-7 rounded-2xl border-2 ${a.border} bg-white hover:shadow-xl ${a.shadow} hover:-translate-y-2 transition-all duration-300 h-full`}>
                    <div className={`w-12 h-12 ${a.icon} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section className="py-4 md:py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              How <span className="text-teal-600">DiagnoOps</span> Works
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">Simple steps to manage your health better</p>
          </FadeIn>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashed connector */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-teal-200" />

            {steps.map(({ n, title, desc }, i) => (
              <FadeIn key={n} delay={i * 0.12} direction="up">
                <div className="relative bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 text-center group">
                  <div className="w-14 h-14 bg-teal-600 group-hover:bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-200 transition-colors duration-200">
                    <span className="text-white font-black text-lg">{n}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              What Our <span className="text-teal-600">Users Say</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">Join thousands of satisfied customers using DiagnoOps</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, loc, grad }, i) => (
              <FadeIn key={name} delay={i * 0.1} direction="up">
                <div className="group bg-white border-2 border-gray-100 hover:border-teal-100 rounded-2xl p-7 hover:shadow-xl hover:shadow-teal-50 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">"{quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex-shrink-0 ring-2 ring-white shadow-md`} />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{name}</p>
                      <p className="text-gray-400 text-xs">{loc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SERVICES / LABS
      ══════════════════════════════════ */}
      <section id="services" className=" md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Our Network
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Find Your <span className="text-teal-600">Nearby Labs</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">Explore our network of trusted diagnostic centers across India</p>
          </FadeIn>

          {loading && (
            <div className="flex justify-center items-center py-20 gap-3 text-teal-600">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm font-medium">Loading labs...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex justify-center py-16">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-md">
                <p className="text-red-500 font-bold mb-1">Failed to load labs</p>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && labsData.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedLabs.map((lab, i) => (
                  <FadeIn key={lab._id} delay={i * 0.07} direction="up">
                    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
                      {/* Image */}
                      <div className="relative h-44 bg-gradient-to-br from-teal-500 to-cyan-500 overflow-hidden">
                        {lab.labPhoto
                          ? <img src={lab.labPhoto} alt={lab.labName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="flex items-center justify-center h-full text-5xl">🏥</div>
                        }
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      {/* Info */}
                      <div className="p-5 flex flex-col flex-1 space-y-3">
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{lab.labName}</h3>
                        <div className="space-y-2 flex-1">
                          {lab.ownerName && (
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <span>👤</span><span>{lab.ownerName}</span>
                            </div>
                          )}
                          {lab.address && (
                            <div className="flex items-start gap-2 text-gray-400 text-xs">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-teal-500" />
                              <span>{lab.address}</span>
                            </div>
                          )}
                          {(lab.openingTime || lab.closingTime) && (
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <Clock className="w-3.5 h-3.5 text-teal-500" />
                              <span>{lab.openingTime || '—'} – {lab.closingTime || '—'}</span>
                            </div>
                          )}
                          {(lab.experience === 0 || lab.experience) && (
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <span>📅</span><span>{lab.experience} years experience</span>
                            </div>
                          )}
                        </div>
                        <button className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors duration-200">
                          View Details
                        </button>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <div className="text-center mt-12">
                {!showAllLabs && labsData.length > 4 && (
                  <button
                    onClick={() => setShowAllLabs(true)}
                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-teal-100 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    See All Labs ({labsData.length})
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                {showAllLabs && (
                  <button
                    onClick={() => setShowAllLabs(false)}
                    className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-10 py-4 rounded-2xl transition-all duration-200"
                  >
                    Show Less
                  </button>
                )}
              </div>
            </>
          )}

          {!loading && !error && labsData.length === 0 && (
            <p className="text-center text-gray-400 py-16 text-sm">No labs available at the moment.</p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════
          CONTACT
      ══════════════════════════════════ */}
      <section id="contact" className="py-4 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Get In <span className="text-teal-600">Touch</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">Have questions? We're here to help!</p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Info cards */}
            <FadeIn direction="right" className="space-y-5">
              {[
                { Icon: PhoneIcon,  title: 'Phone',   l1: '+1 (555) 123-4567',       l2: 'Available 24/7',           color: 'text-teal-600', bg: 'bg-teal-50'  },
                { Icon: () => <span className="text-xl">✉️</span>, title: 'Email', l1: 'support@diagnoops.com', l2: "We'll reply within 24 hours", color: 'text-cyan-600',  bg: 'bg-cyan-50'  },
                { Icon: MapPinIcon, title: 'Address', l1: '123 Healthcare Hub',       l2: 'Medical City, MC 12345',   color: 'text-blue-600', bg: 'bg-blue-50'  },
              ].map(({ Icon, title, l1, l2, color, bg }) => (
                <div key={title} className="flex items-start gap-5 bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
                    <p className="text-gray-600 text-sm">{l1}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{l2}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 h-44 bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-teal-200 mx-auto mb-2" />
                  <p className="text-gray-300 text-xs">Map Integration</p>
                </div>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn direction="left" delay={0.1}>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 sm:p-10 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6">Send us a message</h3>
                <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                    <input type="text" placeholder="Enter your name" className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" placeholder="Enter your email" className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message</label>
                    <textarea rows={5} placeholder="Write your message..." className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none" />
                  </div>
                  <button type="submit" className="group w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-teal-100 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Send Message
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </form>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA
      ══════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white opacity-5 rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-dots)" />
          </svg>
        </div>

        <FadeIn className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 border border-white/20 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to Take Control<br />of Your Health?
          </h2>
          <p className="text-teal-100 text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who have already made the switch to DiagnoOps for better health management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group inline-flex items-center justify-center gap-2 bg-white text-teal-700 hover:bg-teal-50 px-10 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all duration-200 hover:-translate-y-0.5">
              Get Started Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center justify-center border-2 border-white/40 hover:border-white/70 text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5">
              Schedule Demo
            </button>
          </div>
        </FadeIn>
      </section>

    </div>
  )
}

export default Home