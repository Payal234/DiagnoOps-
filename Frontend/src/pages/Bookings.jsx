import { useEffect, useState } from "react";

const BOOKING_STEPS = [
  "Booked",
  "Sample Collected",
  "Processing",
  "Report Ready",
  "Approved",
];

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
    } catch (err) {
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
        if (data?.success) {
          setBookings(data.orders || []);
        } else {
          setError(data?.error || "Unable to load bookings.");
        }
      })
      .catch((err) => setError(err.message || "Unable to load bookings."))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="w-full">
      {/* Header with Title and Tabs */}
      <div className="bg-white border-b border-gray-200 mb-6 -mx-6 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          
          {/* Tab Buttons */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setView("active")}
              className={`px-4 py-2 font-semibold text-sm rounded-md transition ${
                view === "active"
                  ? "bg-white text-blue-600 border border-blue-200 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setView("history")}
              className={`px-4 py-2 font-semibold text-sm rounded-md transition ${
                view === "history"
                  ? "bg-white text-blue-600 border border-blue-200 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">

      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-600">
          Loading bookings...
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {!loading && bookings.length === 0 && !error && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-600">
          You have no completed bookings yet.
        </div>
      )}

      {!loading && bookings.length > 0 && !error && (
        <>
          {view === "active" ? (
            <>
              {bookings.filter((o) => o.bookingStatus !== "Approved").length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-gray-600">
                  No active bookings. All your tests have been approved!
                </div>
              ) : (
                bookings
                  .filter((o) => o.bookingStatus !== "Approved")
                  .map((order) => {
                    const statusIndex = Math.max(
                      0,
                      BOOKING_STEPS.indexOf(order.bookingStatus) >= 0
                        ? BOOKING_STEPS.indexOf(order.bookingStatus)
                        : 0
                    );
                    const title = order.items?.[0]?.name || "Booking";

                    return (
                      <div
                        key={order._id}
                        className="bg-white p-4 sm:p-5 rounded-xl shadow w-full"
                      >
                        <div className="flex justify-between items-start sm:items-center mb-2 gap-2">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              {order.orderId || order._id} • {order.createdAt ? new Date(order.createdAt).toLocaleString() : "No date"}
                            </p>
                          </div>

                          <span className="font-bold text-blue-600 text-sm sm:text-base">
                            ₹{order.amount?.toFixed(2) || 0}
                          </span>
                        </div>

                        <div className="mb-4 text-sm text-gray-600">
                          <p>Status: <span className="font-semibold text-slate-800">{order.bookingStatus || "Booked"}</span></p>
                        </div>

                        <div className="sm:hidden space-y-4">
                          {BOOKING_STEPS.map((step, index) => (
                            <div key={index} className="flex items-start gap-3 relative">
                              {index !== BOOKING_STEPS.length - 1 && (
                                <div
                                  className={`absolute left-2 top-4 w-0.5 h-full ${index < statusIndex ? "bg-green-500" : "bg-gray-200"}`}
                                ></div>
                              )}

                              <div className={`w-4 h-4 rounded-full mt-1 ${index <= statusIndex ? "bg-green-500" : "bg-gray-300"}`}></div>

                              <p className={`text-sm ${index <= statusIndex ? "text-green-600 font-medium" : "text-gray-400"}`}>
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="hidden sm:flex items-center justify-between relative">
                          {BOOKING_STEPS.map((step, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center relative">
                              {index !== BOOKING_STEPS.length - 1 && (
                                <div
                                  className={`absolute top-2 left-1/2 w-full h-0.5 ${index < statusIndex ? "bg-green-500" : "bg-gray-200"}`}
                                ></div>
                              )}

                              <div className={`w-4 h-4 rounded-full z-10 ${index <= statusIndex ? "bg-green-500" : "bg-gray-300"}`}></div>

                              <p className={`text-xs mt-2 ${index <= statusIndex ? "text-green-600 font-medium" : "text-gray-400"}`}>
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
              )}
            </>
          ) : (
            <>
              {bookings.filter((o) => o.bookingStatus === "Approved").length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-gray-600">
                  No approved bookings yet.
                </div>
              ) : (
                bookings
                  .filter((o) => o.bookingStatus === "Approved")
                  .map((order) => {
                    const title = order.items?.[0]?.name || "Booking";

                    return (
                      <div
                        key={order._id}
                        className="bg-white p-4 sm:p-5 rounded-xl shadow w-full"
                      >
                        <div className="flex justify-between items-start sm:items-center mb-2 gap-2">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              {order.orderId || order._id} • {order.createdAt ? new Date(order.createdAt).toLocaleString() : "No date"}
                            </p>
                          </div>

                          <span className="font-bold text-blue-600 text-sm sm:text-base">
                            ₹{order.amount?.toFixed(2) || 0}
                          </span>
                        </div>

                        <div className="mb-4 text-sm text-gray-600 space-y-2">
                          <p>Status: <span className="font-semibold text-emerald-600">{order.bookingStatus || "Booked"}</span></p>
                          {order.userContact && <p>Contact: <span className="font-medium">{order.userContact}</span></p>}
                          {order.userAddress && <p>Address: <span className="font-medium">{order.userAddress}</span></p>}
                          {order.paymentStatus && <p>Payment: <span className={`font-medium ${order.paymentStatus === "success" ? "text-green-600" : "text-amber-600"}`}>{order.paymentStatus === "success" ? "Paid" : "Pending"}</span></p>}
                        </div>

                        <div className="space-y-2">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                                <span>{item.name}</span>
                                {item.quantity && <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">×{item.quantity}</span>}
                              </div>
                              <span className="font-semibold text-gray-700">₹{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
              )}
            </>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Bookings;
