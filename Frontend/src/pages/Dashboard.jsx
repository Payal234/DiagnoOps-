import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const bookingsData = [
  { month: "Sep", bookings: 8, completed: 6 },
  { month: "Oct", bookings: 14, completed: 11 },
  { month: "Nov", bookings: 10, completed: 8 },
  { month: "Dec", bookings: 18, completed: 15 },
  { month: "Jan", bookings: 13, completed: 10 },
  { month: "Feb", bookings: 12, completed: 7 },
];

const recentBookings = [
  { id: "BK-1042", test: "Complete Blood Count", date: "2026-02-27", status: "Processing" },
  { id: "BK-1041", test: "Lipid Profile", date: "2026-02-25", status: "Approved" },
  { id: "BK-1040", test: "Thyroid Panel", date: "2026-02-22", status: "Report Ready" },
  { id: "BK-1039", test: "Vitamin D Test", date: "2026-02-20", status: "Approved" },
];

const statusStyles = {
  Processing: "bg-amber-100 text-amber-700 border border-amber-300",
  Approved: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  "Report Ready": "bg-teal-100 text-teal-700 border border-teal-300",
  Completed: "bg-blue-100 text-blue-700 border border-blue-300",
};

const stats = [
  { label: "Total Bookings", value: 12, bg: "bg-teal-600", text: "text-white", iconBg: "bg-white/20", icon: "📅" },
  { label: "Reports Ready", value: 3, bg: "bg-green-500", text: "text-white", iconBg: "bg-white/20", icon: "📄" },
  { label: "Pending", value: 2, bg: "bg-blue-500", text: "text-white", iconBg: "bg-white/20", icon: "⏳" },
  { label: "Completed", value: 7, bg: "bg-white border border-slate-200", text: "text-slate-800", iconBg: "bg-slate-100", icon: "✅" },
];

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const slogans = [
    "Trusted Diagnostics, Trusted Care",
    "Your Health, Our Priority",
    "Accuracy in Every Report",
  ];

  // ✅ Get logged in user
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryUserId = params.get("userId");

    if (queryUserId) {
      axios
        .get(`${backendUrl}/api/auth/profile/${queryUserId}`)
        .then((res) => {
          const user = res.data;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userId", user._id);
          setUserName(user.name || "Patient");
        })
        .finally(() => {
          window.history.replaceState({}, "", window.location.pathname);
        });
      return;
    }

    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (e) {
        setUserName(stored);
      }
    }
  }, [backendUrl]);

  // ✅ Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* Main Content Wrapper */}
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2 space-y-6">

        {/* Greeting Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's your health overview
          </p>
        </div>

        {/* Slogan area: single line */}
        <div className="mb-4 sm:mb-6 text-center">
          <p className="text-base sm:text-lg font-semibold text-teal-600 break-words">
            {slogans.join(" — ")}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl p-4 sm:p-5 flex items-start justify-between ${card.bg} ${card.text}`}
            >
              <div>
                <p className={`text-xs sm:text-sm font-medium ${card.text === "text-white" ? "text-white/80" : "text-slate-500"}`}>
                  {card.label}
                </p>
                <p className="text-3xl sm:text-4xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Monthly Bookings vs Completed</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bookingsData} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="bookings" fill="#0d9488" radius={[4, 4, 0, 0]} name="Bookings" />
                <Bar dataKey="completed" fill="#6ee7b7" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Booking Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="bookings" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4, fill: "#0d9488" }} name="Bookings" />
                <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Recent Bookings</h2>
            <button className="text-xs bg-teal-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-700 transition-colors">
              + New Booking
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  {["Booking ID", "Test", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{b.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.test}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{b.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[b.status] || "bg-slate-100 text-slate-600"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden flex flex-col divide-y divide-slate-100">
            {recentBookings.map((b) => (
              <div key={b.id} className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-slate-700">{b.id}</p>
                  <p className="text-sm text-slate-600">{b.test}</p>
                  <p className="text-xs text-slate-400">{b.date}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${statusStyles[b.status] || "bg-slate-100 text-slate-600"}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;