import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from "recharts";

/* ─── DATA ─────────────────────────────────── */
const KPI = [
  { label: "Total Patients",  value: "1,245",  change: "+12%", up: true,  color: "#818cf8", bg: "#1e1b4b", icon: "M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z" },
  { label: "Today's Bookings",value: "38",     change: "+5",   up: true,  color: "#22d3ee", bg: "#0c2a33", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Pending Reports", value: "14",     change: "−3",   up: false, color: "#fbbf24", bg: "#291a00", icon: "M12 8v4l2 2M12 3a9 9 0 100 18A9 9 0 0012 3z" },
  { label: "Today's Revenue", value: "₹24.5K", change: "+18%", up: true,  color: "#4ade80", bg: "#052e16", icon: "M9 8h6m-5 4h4M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" },
];

const BOOKINGS = [
  { id:"RS", name:"Rahul Sharma",  test:"CBC + Lipid Profile",  time:"10:00 AM", status:"Booked",           ac:"#1e1b4b", tc:"#818cf8" },
  { id:"PP", name:"Priya Patel",   test:"Thyroid Panel",         time:"10:30 AM", status:"Sample Collected", ac:"#0c2a33", tc:"#22d3ee" },
  { id:"AK", name:"Amit Kumar",    test:"Full Body Checkup",     time:"11:00 AM", status:"Processing",       ac:"#291a00", tc:"#fb923c" },
  { id:"NS", name:"Neha Singh",    test:"HbA1c",                 time:"11:30 AM", status:"Report Ready",     ac:"#052e16", tc:"#4ade80" },
  { id:"VJ", name:"Vikram Joshi",  test:"KFT + LFT",             time:"12:00 PM", status:"Booked",           ac:"#1e1b4b", tc:"#818cf8" },
  { id:"MR", name:"Meena Rao",     test:"CBC",                   time:"12:30 PM", status:"Sample Collected", ac:"#0c2a33", tc:"#22d3ee" },
];

const STATUS_STYLE = {
  "Booked":           "bg-blue-50 text-blue-600",
  "Sample Collected": "bg-cyan-50 text-cyan-600",
  "Processing":       "bg-amber-50 text-amber-600",
  "Report Ready":     "bg-emerald-50 text-emerald-600",
};

const WEEKLY = [
  { day:"Mon", bookings:32, revenue:18000 },
  { day:"Tue", bookings:28, revenue:15200 },
  { day:"Wed", bookings:41, revenue:22800 },
  { day:"Thu", bookings:35, revenue:19500 },
  { day:"Fri", bookings:38, revenue:24500 },
  { day:"Sat", bookings:52, revenue:31000 },
  { day:"Sun", bookings:20, revenue:11000 },
];

const TESTS = [
  { name:"CBC",           pct:85, color:"#6366f1" },
  { name:"Lipid Profile", pct:72, color:"#06b6d4" },
  { name:"Thyroid Panel", pct:58, color:"#8b5cf6" },
  { name:"HbA1c",         pct:44, color:"#f59e0b" },
  { name:"KFT + LFT",     pct:36, color:"#10b981" },
];

const DONUT = [
  { name:"Completed", value:24, color:"#4ade80" },
  { name:"In Queue",  value:14, color:"#fbbf24" },
  { name:"Pending",   value:8,  color:"#334155" },
];


/* ─── TOOLTIP ──────────────────────────────── */
const ChartTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? "#94a3b8" }} className="font-semibold">
          {p.name === "revenue" ? `₹${p.value.toLocaleString()}` : p.value}
          <span className="text-slate-400 font-normal ml-1">{p.name}</span>
        </p>
      ))}
    </div>
  ) : null;



/* ─── MAIN ─────────────────────────────────── */
export default function Dashboard() {
  const [chartTab, setChartTab] = useState("revenue");
  const [statusFilter, setStatusFilter] = useState("All");
  const [q, setQ] = useState("");
  const [loggedInLabAdmin, setLoggedInLabAdmin] = useState({ ownerName: "", name: "", labName: "" });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("labAdmin") || "{}");
      setLoggedInLabAdmin(stored);
    } catch {
      setLoggedInLabAdmin({ ownerName: "", name: "", labName: "" });
    }
  }, []);

  const displayName = (loggedInLabAdmin.ownerName || loggedInLabAdmin.name || "Admin").trim();
  const displayLabName = (loggedInLabAdmin.labName || "Your Lab").trim();

  const filtered = BOOKINGS.filter(b => {
    const matchQ = b.name.toLowerCase().includes(q.toLowerCase()) || b.test.toLowerCase().includes(q.toLowerCase());
    const matchS = statusFilter === "All" || b.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">

      {/* ── Main ── */}
      <main className="overflow-y-auto p-6 lg:p-8">

        {/* Topbar */}
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, {displayName}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{displayLabName}</p>
          </div>
         
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
          {KPI.map((k, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10" style={{ background: k.color }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: k.bg }}>
                  <svg className="w-4 h-4" fill="none" stroke={k.color} strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={k.icon} />
                  </svg>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.up ? "bg-[#052e16] text-[#4ade80]" : "bg-[#2d0a0a] text-[#f87171]"}`}>
                  {k.change}
                </span>
              </div>
              <p className="text-[22px] font-extrabold text-slate-900 tracking-tight leading-none">{k.value}</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Left 2/3 */}
          <div className="xl:col-span-2 space-y-5">

            {/* Bookings table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Card head */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-wrap gap-3">
                <div>
                  <p className="text-base font-bold text-slate-800">Today's Bookings</p>
                  <p className="text-sm text-slate-500 mt-0.5">Feb 27, 2026</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["All","Booked","Processing","Report Ready"].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all ${
                        statusFilter === s
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1.5 w-3 h-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                      value={q}
                      onChange={e => setQ(e.target.value)}
                      placeholder="Search…"
                      className="pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-40"
                    />
                  </div>
                </div>
              </div>

              {/* Table head */}
              <div className="grid grid-cols-12 px-5 py-2.5 bg-slate-50 border-b border-slate-200">
                {["Patient","Test","Time","Status"].map((h, i) => (
                  <span key={i} className={`text-xs font-semibold uppercase tracking-wider text-slate-600 ${i===0?"col-span-4":i===1?"col-span-4":i===2?"col-span-2":"col-span-2 text-right"}`}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-slate-600 py-10">No results.</p>
                ) : filtered.map((b, i) => (
                  <div key={i} className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: b.ac, color: b.tc }}
                      >
                        {b.id}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 truncate">{b.name}</span>
                    </div>
                    <span className="col-span-4 text-sm text-slate-500 truncate pr-3">{b.test}</span>
                    <span className="col-span-2 text-sm font-medium text-slate-500">{b.time}</span>
                    <div className="col-span-2 flex justify-end">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[b.status]}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                        <span className="hidden sm:inline">{b.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 pt-4 border-b border-slate-200">
                <p className="text-base font-bold text-slate-800 mb-3">Weekly Analytics</p>
                <div className="flex mb-3">
                  {["revenue","bookings"].map(t => (
                    <button
                      key={t}
                      onClick={() => setChartTab(t)}
                      className={`text-sm font-semibold pb-3 px-4 border-b-2 capitalize transition-all ${
                        chartTab === t
                          ? "border-indigo-500 text-indigo-400"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5">
                {chartTab === "revenue" ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={WEEKLY} margin={{ top:4, right:4, bottom:0, left:0 }}>
                      <defs>
                        <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                      <XAxis dataKey="day" tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${Math.round(v/1000)}k`}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#aG)" dot={false} activeDot={{ r:4, fill:"#6366f1", strokeWidth:0 }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={WEEKLY} barSize={22} margin={{ top:4, right:4, bottom:0, left:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                      <XAxis dataKey="day" tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false}/>
                      <Tooltip content={<ChartTip/>} cursor={{ fill:"#f1f5f9" }}/>
                      <Bar dataKey="bookings" radius={[5,5,0,0]}>
                        {WEEKLY.map((_, i) => (
                          <Cell key={i} fill={i===5?"#6366f1":"#cbd5e1"}/>
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Popular tests */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="text-base font-bold text-slate-800">Popular Tests</p>
                <span className="text-sm text-slate-500">This week</span>
              </div>
              <div className="space-y-4">
                {TESTS.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600 w-28 flex-shrink-0">{t.name}</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width:`${t.pct}%`, background: t.color }}
                      />
                    </div>
                    <span className="text-sm text-slate-500 w-8 text-right">{t.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1/3 */}
          <div className="space-y-5">

            {/* Donut summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-base font-bold text-slate-800 mb-0.5">Today's Summary</p>
              <p className="text-sm text-slate-500 mb-4">Report status breakdown</p>
              <div className="flex items-center gap-5">
                <div className="relative w-[110px] h-[110px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={DONUT} cx="50%" cy="50%" innerRadius={36} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {DONUT.map((d, i) => <Cell key={i} fill={d.color}/>)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-extrabold text-slate-800">46</p>
                    <p className="text-xs text-slate-500 font-medium">total</p>
                  </div>
                </div>
                <div className="flex-1 space-y-2.5">
                  {[
                    { label:"Completed", val:"24", c:"#4ade80" },
                    { label:"In Queue",  val:"14", c:"#fbbf24" },
                    { label:"Pending",   val:"8",  c:"#334155" },
                  ].map((r,i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:r.c }}/>
                        <span className="text-sm text-slate-500">{r.label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-500">Total revenue</span>
                <span className="text-lg font-extrabold text-[#4ade80]">₹24,500</span>
              </div>
            </div>

            {/* Mini KPIs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:"Completed",   val:"24",   sub:"reports", c:"#818cf8" },
                { label:"Walk-ins",    val:"9",    sub:"today",   c:"#22d3ee" },
                { label:"Home Collect",val:"5",    sub:"visits",  c:"#fb923c" },
                { label:"Avg TAT",     val:"2.4h", sub:"turn",    c:"#4ade80" },
              ].map((m, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-[18px] font-extrabold" style={{ color:m.c }}>{m.val}</p>
                  <p className="text-sm font-medium text-slate-600 mt-0.5">{m.label}</p>
                  <p className="text-xs text-slate-500">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Upcoming */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-base font-bold text-slate-800">Upcoming</p>
                <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">View all</button>
              </div>
              <div className="space-y-3.5">
                {BOOKINGS.slice(0, 4).map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background:b.ac, color:b.tc }}
                    >
                      {b.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-700 truncate">{b.name}</p>
                      <p className="text-xs text-slate-500 truncate">{b.test}</p>
                    </div>
                    <span className="text-sm text-slate-500 flex-shrink-0">{b.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-base font-bold text-slate-800 mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button className="w-full text-sm font-semibold py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
                  + New Booking
                </button>
                {["Add Patient","View All Reports","Print Queue"].map((a, i) => (
                  <button key={i} className="w-full text-sm font-semibold py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 border border-slate-200 transition-all">
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}