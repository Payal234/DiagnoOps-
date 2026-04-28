import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    bloodGroup: "",
    gender: "",
    age: "",
    allergies: "",
  });
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "https://diagnoops-backend.vercel.app";
  const userDashboardUrl =
    import.meta.env.VITE_USER_DASHBOARD_URL || "http://localhost:5174/";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/auth/register`, form);

      const loginRes = await axios.post(`${backendUrl}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("diagnopsUser", JSON.stringify(loginRes.data.user));
      setRedirecting(true);
      const redirectUrl = new URL(userDashboardUrl);
      if (loginRes.data.user?._id) {
        redirectUrl.searchParams.set("userId", loginRes.data.user._id);
      }
      setTimeout(() => {
        window.location.href = redirectUrl.toString();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
      setLoading(false);
      setRedirecting(false);
    }
  };

  // Reusable base class for all inputs to keep code clean
  const inputBaseClass =
    "w-full bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 transition-all duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {redirecting && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-7 shadow-2xl flex flex-col items-center gap-3">
            <svg
              className="w-8 h-8 animate-spin text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <p className="text-slate-700 font-semibold">
              Registration successful
            </p>
            <p className="text-slate-500 text-sm">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      {/* 1. Pathology Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          // High-quality clinical lab image from Unsplash
          backgroundImage:
            "url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* 2. Color Theme Overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-teal-900/80 via-slate-800/80 to-teal-950/90 backdrop-blur-[3px]" />

      {/* Decorative Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-400 opacity-20 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-300 opacity-20 blur-[100px] pointer-events-none -z-10" />

      {/* Form Container (Wider max-w-2xl for grid layout) */}
      <div className="w-full max-w-2xl z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-xl mb-3">
            <svg
              className="w-7 h-7 text-teal-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold tracking-wider">
            DIAGNOOPS <span className="text-teal-400 font-light">LABS</span>
          </h2>
        </div>

        {/* 3. Glassmorphism Card */}
        <div className="relative w-full bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-70" />

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Patient Registration
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Create your account to access your lab reports
            </p>
          </div>

          {/* Form - Uses CSS Grid for 2 columns on medium screens */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Full Width: Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Full Name
              </label>
              <input
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                required
                className={inputBaseClass}
              />
            </div>

            {/* Half Width: Email & Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                onChange={handleChange}
                required
                className={inputBaseClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className={inputBaseClass}
              />
            </div>

            {/* Half Width: Phone & Age */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                onChange={handleChange}
                required
                className={inputBaseClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Age
              </label>
              <input
                name="age"
                type="number"
                placeholder="Years"
                onChange={handleChange}
                required
                className={inputBaseClass}
              />
            </div>

            {/* Half Width: Gender & Blood Group */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Gender
              </label>
              <select
                name="gender"
                onChange={handleChange}
                required
                className={`${inputBaseClass} appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[position:right_1rem_center] pr-10 text-slate-500`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Blood Group
              </label>
              <input
                name="bloodGroup"
                placeholder="e.g. O+, A-, B+"
                onChange={handleChange}
                required
                className={inputBaseClass}
              />
            </div>

            {/* Full Width: Allergies */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Known Allergies
              </label>
              <input
                name="allergies"
                placeholder="List any known medical or food allergies (or 'None')"
                onChange={handleChange}
                className={inputBaseClass}
              />
            </div>

            {/* Full Width: Address */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1">
                Home Address
              </label>
              <textarea
                name="address"
                placeholder="Enter your full home address"
                rows="2"
                onChange={handleChange}
                required
                className={`${inputBaseClass} resize-none`}
              />
            </div>

            {/* Submit button */}
            <div className="md:col-span-2 mt-4">
              {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 shadow-lg shadow-teal-500/30 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Registering…
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/join-patient"
                className="text-teal-500 font-semibold hover:text-teal-400 hover:underline underline-offset-2 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
