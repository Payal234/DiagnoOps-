import { useEffect, useState } from "react";

const BOOKING_STEPS = [
  "Booked",
  "Sample Collected",
  "Processing",
  "Report Ready",
  "Approved",
];

const statusColors = {
  Booked: "bg-blue-50 text-blue-700 border-blue-200",
  "Sample Collected": "bg-green-50 text-green-700 border-green-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  "Report Ready": "bg-purple-50 text-purple-700 border-purple-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const StatusDot = ({ index, statusIndex }) => {
  if (index < statusIndex)
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center z-10">
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  if (index === statusIndex)
    return (
      <div className="w-7 h-7 rounded-full bg-blue-500 ring-4 ring-blue-100 flex items-center justify-center z-10">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    );
  return (
    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center z-10">
      <div className="w-2 h-2 rounded-full bg-gray-400" />
    </div>
  );
};

const ActiveCard = ({ order }) => {
  const statusIndex = Math.max(
    0,
    BOOKING_STEPS.indexOf(order.bookingStatus) >= 0
      ? BOOKING_STEPS.indexOf(order.bookingStatus)
      : 0
  );
  const title = order.items?.[0]?.name || "Booking";
  const badgeClass = statusColors[order.bookingStatus] || statusColors.Booked;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {/* Top row */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
          <p className="font-mono text-xs text-gray-400 mt-1">
            {order.orderId || order._id} •{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "No date"}
          </p>
        </div>
        <span className="text-lg font-bold text-blue-600 shrink-0">
          ₹{order.amount?.toFixed(2) || "0.00"}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${badgeClass}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {order.bookingStatus || "Booked"}
        </span>
      </div>

      {/* Desktop stepper */}
      <div className="hidden sm:flex w-full items-center">
        {BOOKING_STEPS.map((step, index) => (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <StatusDot index={index} statusIndex={statusIndex} />
              <p
                className={`text-xs mt-2 text-center whitespace-nowrap ${
                  index < statusIndex
                    ? "text-green-600 font-medium"
                    : index === statusIndex
                    ? "text-blue-600 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
            {index < BOOKING_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-5 mx-1 ${
                  index < statusIndex ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile stepper */}
      <div className="sm:hidden space-y-0">
        {BOOKING_STEPS.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  index < statusIndex
                    ? "bg-green-500"
                    : index === statusIndex
                    ? "bg-blue-500 ring-4 ring-blue-100"
                    : "bg-gray-200"
                }`}
              >
                {index < statusIndex ? (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === statusIndex ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                )}
              </div>
              {index < BOOKING_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-5 ${
                    index < statusIndex ? "bg-green-300" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <p
              className={`text-sm pt-1 pb-4 ${
                index < statusIndex
                  ? "text-green-600 font-medium"
                  : index === statusIndex
                  ? "text-blue-600 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HistoryCard = ({ order }) => {
  const title = order.items?.[0]?.name || "Booking";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
          <p className="font-mono text-xs text-gray-400 mt-1">
            {order.orderId || order._id} •{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "No date"}
          </p>
        </div>
        <span className="text-lg font-bold text-blue-600 shrink-0">
          ₹{order.amount?.toFixed(2) || "0.00"}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Approved
        </span>
      </div>

      <div className="space-y-2">
        {(order.items || []).map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
              <span className="text-gray-700">{item.name}</span>
              {item.quantity && (
                <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-lg border border-gray-100">
                  ×{item.quantity}
                </span>
              )}
            </div>
            <span className="font-semibold text-gray-800">₹{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
      <svg
        className="w-6 h-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("active");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      setUser({});
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const userId = user._id || user.userId;
    if (!userId) {
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }

    fetch(`https://diagnoops-backend.vercel.app/api/payment/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) setBookings(data.orders || []);
        else setError(data?.error || "Unable to load bookings.");
      })
      .catch((err) => setError(err.message || "Unable to load bookings."))
      .finally(() => setLoading(false));
  }, [user]);

  const activeBookings = bookings.filter((o) => o.bookingStatus !== "Approved");
  const historyBookings = bookings.filter((o) => o.bookingStatus === "Approved");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 mb-6 -mx-6 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-500 tracking-widest uppercase mb-1">
              DiagnoOps
            </p>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {["active", "history"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setView(tab)}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all capitalize cursor-pointer${
                  view === tab
                    ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-gray-500 text-sm">
            Loading bookings...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <EmptyState message="You have no bookings yet." />
        )}

        {!loading && !error && bookings.length > 0 && (
          <>
            {view === "active" &&
              (activeBookings.length === 0 ? (
                <EmptyState message="No active bookings. All your tests have been approved!" />
              ) : (
                activeBookings.map((order) => (
                  <ActiveCard key={order._id} order={order} />
                ))
              ))}

            {view === "history" &&
              (historyBookings.length === 0 ? (
                <EmptyState message="No approved bookings yet." />
              ) : (
                historyBookings.map((order) => (
                  <HistoryCard key={order._id} order={order} />
                ))
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;