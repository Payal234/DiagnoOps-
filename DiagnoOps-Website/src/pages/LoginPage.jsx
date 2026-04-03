import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const userDashboardUrl =
    import.meta.env.VITE_USER_DASHBOARD_URL || "http://localhost:5174/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("diagnopsUser", JSON.stringify(res.data.user));
      setRedirecting(true);

      setTimeout(() => {
        const redirectUrl = new URL(userDashboardUrl);
        if (res.data.user?._id) {
          redirectUrl.searchParams.set("userId", res.data.user._id);
        }
        window.location.href = redirectUrl.toString();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
      setRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {redirecting && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-7 shadow-2xl flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin text-teal-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-slate-700 font-semibold">Login successful</p>
            <p className="text-slate-500 text-sm">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
      
      {/* 1. Pathology Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          // High-quality clinical lab/microscope image from Unsplash
          backgroundImage:
            "url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* 2. Color Theme Overlay (Maintains your Teal/Slate vibe while ensuring readability) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-teal-900/70 via-slate-800/80 to-teal-950/90 backdrop-blur-[2px]" />

      {/* Decorative Orbs behind the card */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-400 opacity-20 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-300 opacity-20 blur-[100px] pointer-events-none z-0" />

      {/* Form Container */}
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        {/* Lab Logo / Brand Icon (Optional enhancement) */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-xl mb-3">
             <svg className="w-8 h-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
          </div>
          <h2 className="text-white text-xl font-bold tracking-wider">DIAGNOOPS <span className="text-teal-400 font-light">LABS</span></h2>
        </div>

        {/* 3. Glassmorphism Card */}
        <div className="relative w-full bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-70" />

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Sign in to access your pathology portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* 4. Fixed Input Layout (Separated Email & Password) */}
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  required
                  className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 transition-all duration-300"
                />
              </div>
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs text-teal-600 hover:text-teal-500 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 animate-pulse">
                <svg
                  className="w-4 h-4 text-red-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                </svg>
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 shadow-lg shadow-teal-500/30 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Authenticating…
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

       
           {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-500 font-semibold hover:text-teal-400 hover:underline underline-offset-2 transition-colors duration-200">
                Sign up here
              </Link>
            </p>
          </div>

       
       </div>
    </div>
    </div>
  )
}

