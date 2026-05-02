import React, { useEffect, useState, useRef } from "react";

const BOOKING_STEPS = [
  "Booked",
  "Sample Collected",
  "Processing",
  "Report Ready",
  "Approved",
];

const DECISION_OPTIONS = ["Confirm", "Rejected"];

const normalizeBookingStatus = (status) => {
  if (String(status || "").trim().toLowerCase() === "booking confirm") {
    return "Approved";
  }
  return status || "Booked";
};

const STEP_COLORS = [
  { active: "bg-cyan-500", text: "text-cyan-600", light: "bg-cyan-50" },
  { active: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  { active: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50" },
  { active: "bg-violet-500", text: "text-violet-600", light: "bg-violet-50" },
  { active: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
  { active: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" },
];

const AVATAR_COLORS = [
  { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
  { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200" },
  { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" },
  { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
];

const Patients = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [view, setView] = useState("patients");
  const abortControllerRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://diagnoops-backend.vercel.app";

  const getToken = () => {
    const raw = (localStorage.getItem("labAdminToken") || localStorage.getItem("adminToken") || "").trim();
    if (!raw) return "";
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      try { return JSON.parse(raw); } catch { return raw.slice(1, -1); }
    }
    if (raw.toLowerCase().startsWith("bearer ")) return raw.slice(7).trim();
    return raw;
  };

  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    setLoading(true);
    setError("");
    const adminToken = getToken();
    if (!adminToken) { setLoading(false); setError("Please login again. Token missing."); return; }
    const headers = { "Content-Type": "application/json", ...(adminToken && { Authorization: `Bearer ${adminToken}` }) };
    fetch(`${backendUrl}/api/payment/orders/admin/me`, { headers, signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch orders");
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      })
      .catch((err) => { if (err.name !== "AbortError") { console.error(err); setError(err.message); } })
      .finally(() => setLoading(false));
    return () => abortControllerRef.current?.abort();
  }, [backendUrl]);

  const updateBookingStatus = async (dbOrderId, nextStatus) => {
    const adminToken = getToken();
    if (!adminToken) { setError("Please login again. Token missing."); return; }
    try {
      setUpdatingOrderId(String(dbOrderId));
      setError("");
      const res = await fetch(`${backendUrl}/api/payment/orders/${dbOrderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ bookingStatus: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || data?.message || "Failed to update status");
      setOrders((prev) => prev.map((o) => (o._id === dbOrderId ? data.order : o)));
    } catch (e) {
      setError(e?.message || "Failed to update status");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const byPatient = orders.reduce((acc, order) => {
    const email = (order?.userEmail || "").toLowerCase().trim() || "unknown";
    if (!acc[email]) acc[email] = [];
    acc[email].push(order);
    return acc;
  }, {});

  const patientGroups = Object.entries(byPatient).map(([email, patientOrders], idx) => {
    const latest = patientOrders[0] || {};
    return {
      key: email,
      email: latest.userEmail || email,
      name: latest.userName || "Unknown",
      phone: latest.userContact || "N/A",
      location: latest.userAddress || latest.userLocation || "",
      age: latest.userAge,
      gender: latest.userGender,
      bloodGroup: latest.userBloodGroup,
      allergies: latest.userAllergies,
      orders: patientOrders,
      colorIdx: idx % AVATAR_COLORS.length,
    };
  });

  const approvedOrders = orders
    .filter((o) => normalizeBookingStatus(o?.bookingStatus) === "Approved")
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Nav Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-none">Patient Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Lab Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full">
            <button
              type="button"
              onClick={() => {
                setView("patients");
                setExpandedPatient(null);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${view === "patients" ? "bg-white text-slate-800 border border-slate-200" : "text-slate-600 hover:text-slate-800"}`}
            >
              Patients
            </button>
            <button
              type="button"
              onClick={() => {
                setView("history");
                setExpandedPatient(null);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${view === "history" ? "bg-white text-slate-800 border border-slate-200" : "text-slate-600 hover:text-slate-800"}`}
            >
              History
            </button>
          </div>

          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            {patientGroups.length} Total Patients
          </span>
          <span className="text-xs text-cyan-700 bg-cyan-50 border border-cyan-100 px-3 py-1.5 rounded-full font-semibold">
            {orders.length} Orders
          </span>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full font-semibold">
            {approvedOrders.length} Approved
          </span>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-blue-600 text-xl mb-6">
            <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Fetching patient records…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-red-600 text-2xl mb-6">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && patientGroups.length === 0 && !error && (
          <div className="text-center py-24 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium text-slate-500">No patient records found</p>
            <p className="text-sm mt-1">Orders will appear here once patients book tests.</p>
          </div>
        )}

        {view === "history" ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-800">Approved Order History</h2>
              <p className="text-xs text-slate-400 mt-1">All orders with booking status “Approved”.</p>
            </div>

            {approvedOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-10 text-center text-slate-400 shadow-sm">
                No approved orders yet.
              </div>
            ) : (
              approvedOrders.map((order, i) => {
                const isPaid = order.paymentStatus === "success" || order.status === "success";
                return (
                  <div key={order._id || i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {order.userName || order.userEmail || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{order.userEmail || "—"}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-slate-400">{order.userContact || "N/A"}</span>
                          {order.userAddress ? (
                            <span title={order.userAddress} className="text-xs text-slate-400 max-w-[28rem] truncate">
                              {order.userAddress}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">Location N/A</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100">
                          Approved
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                        <span>Order #{order.orderId?.slice(-6) || "------"}</span>
                        <span>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {(order.items || []).map((test, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100 last:border-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                              <span className="text-sm text-slate-600 truncate">{test.name}</span>
                              {test.quantity && (
                                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">×{test.quantity}</span>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-slate-700 flex-shrink-0">₹{test.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Patient List */
          <div className="space-y-4">
          {patientGroups.map((patient) => {
            const initials = patient.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
            const ac = AVATAR_COLORS[patient.colorIdx];
            const isExpanded = expandedPatient === patient.key;
            const activeOrders = patient.orders.filter((o) => normalizeBookingStatus(o?.bookingStatus) !== "Approved");
            const latestStatus = normalizeBookingStatus(activeOrders[0]?.bookingStatus) || "—";
            const allPaid = activeOrders.length
              ? activeOrders.every((o) => o.paymentStatus === "success" || o.status === "success")
              : true;

            return (
              <div key={patient.key} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

                {/* Patient Row — clickable */}
                <div
                  role="button"
                  tabIndex={0}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setExpandedPatient(isExpanded ? null : patient.key);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedPatient(isExpanded ? null : patient.key);
                    }
                  }}
                >
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full ${ac.bg} ${ac.text} border ${ac.border} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 text-xl">{patient.name}</span>
                      {patient.bloodGroup && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">{patient.bloodGroup}</span>
                      )}
                      {patient.allergies && patient.allergies !== "None" && (
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">⚠ Allergy</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-slate-400">{patient.email}</span>
                      <span className="text-xs text-slate-400">{patient.phone}</span>
                      {patient.age && <span className="text-xs text-slate-400">Age {patient.age}</span>}
                      {patient.gender && <span className="text-xs text-slate-400">{patient.gender}</span>}
                      {patient.location ? (
                        <span title={patient.location} className="text-xs text-slate-400 max-w-[18rem] truncate">
                          {patient.location}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">Location N/A</span>
                      )}
                    </div>
                  </div>

                  {/* Right side stats */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400">Orders</p>
                      <p className="text-sm font-bold text-slate-700">{activeOrders.length}</p>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400">Payment</p>
                      <span className={`text-xs font-semibold ${allPaid ? "text-emerald-600" : "text-amber-600"}`}>
                        {allPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-slate-400">Status</p>
                      <span className="text-xs font-semibold text-cyan-700">{latestStatus}</span>
                    </div>
                    {/* Chevron */}
                    <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Orders */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">

                    {/* Patient detail strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                      {[
                        { label: "Age", value: patient.age ?? "N/A" },
                        { label: "Gender", value: patient.gender || "N/A" },
                        { label: "Blood Group", value: patient.bloodGroup || "N/A" },
                        { label: "Location", value: patient.location || "N/A" },
                        { label: "Allergies", value: patient.allergies || "None" },
                      ].map((item) => (
                        <div key={item.label} className="bg-white rounded-xl border border-slate-200 px-3 py-2.5">
                          <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                          <p className={`text-sm font-semibold mt-0.5 ${item.label === "Allergies" && item.value !== "None" ? "text-amber-600" : item.label === "Blood Group" ? "text-red-600" : "text-slate-700"}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {activeOrders.map((order, i) => {
                        const isPaid = order.paymentStatus === "success" || order.status === "success";
                        const displayStatus = normalizeBookingStatus(order.bookingStatus);
                        const statusIndex = Math.max(0, BOOKING_STEPS.indexOf(displayStatus) >= 0 ? BOOKING_STEPS.indexOf(displayStatus) : 0);

                        return (
                          <div key={order._id || i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">

                            {/* Order header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-700">Order #{order.orderId?.slice(-6) || "------"}</p>
                                  <p className="text-xs text-slate-400">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                                  {isPaid ? "Paid" : "Pending"}
                                </span>
                              </div>
                            </div>

                            <div className="px-4 py-3">
                              {/* Tests */}
                              <div className="mb-4">
                                {order.items?.map((test, idx) => (
                                  <div key={idx} className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100 last:border-0">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0"></div>
                                      <span className="text-sm text-slate-600">{test.name}</span>
                                      {test.quantity && <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">×{test.quantity}</span>}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">₹{test.price}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Progress Stepper */}
                              <div className="mb-4">
                                <div className="flex items-start">
                                  {BOOKING_STEPS.map((step, index) => {
                                    const isCompleted = index < statusIndex;
                                    const isCurrent = index === statusIndex;
                                                const sc = STEP_COLORS[index] || STEP_COLORS[STEP_COLORS.length - 1];
                                    return (
                                      <div key={step} className="flex-1 flex flex-col items-center relative">
                                        {index !== BOOKING_STEPS.length - 1 && (
                                          <div className={`absolute top-2.5 left-1/2 w-full h-0.5 ${isCompleted ? "bg-emerald-400" : "bg-slate-200"}`} />
                                        )}
                                        <div className={`w-5 h-5 rounded-full z-10 flex items-center justify-center transition-all ${
                                          isCompleted ? "bg-emerald-500 border-2 border-emerald-500" :
                                          isCurrent ? `${sc.active} border-2 border-transparent shadow-sm scale-110` :
                                          "bg-white border-2 border-slate-300"
                                        }`}>
                                          {isCompleted && (
                                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                          )}
                                        </div>
                                        <p className={`hidden sm:block text-[10px] mt-1.5 text-center leading-tight px-0.5 font-medium ${
                                          isCompleted ? "text-emerald-600" :
                                          isCurrent ? sc.text + " font-bold" :
                                          "text-slate-400"
                                        }`}>
                                          {step}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Update status:</label>
                                  <select
                                    className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-40 cursor-pointer"
                                    value={normalizeBookingStatus(order.bookingStatus)}
                                    onChange={(e) => updateBookingStatus(order._id, e.target.value)}
                                    disabled={updatingOrderId === String(order._id)}
                                  >
                                    {BOOKING_STEPS.map((s) => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Decision:</label>
                                  <select
                                    className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-40 cursor-pointer"
                                    value={DECISION_OPTIONS.includes(normalizeBookingStatus(order.bookingStatus)) ? normalizeBookingStatus(order.bookingStatus) : ""}
                                    onChange={(e) => updateBookingStatus(order._id, e.target.value)}
                                    disabled={updatingOrderId === String(order._id)}
                                  >
                                    <option value="" disabled>Select decision</option>
                                    {DECISION_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </div>

                                {updatingOrderId === String(order._id) && (
                                  <span className="flex items-center gap-1.5 text-xs text-cyan-600">
                                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Saving…
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {activeOrders.length === 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 px-4 py-6 text-center text-slate-400">
                          No active orders. Approved orders are available in History.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};

export default Patients;