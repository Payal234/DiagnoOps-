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

    fetch(`http://localhost:5000/api/payment/orders/user/${userId}`)
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
    <div className="px-3 sm:px-6 py-6 space-y-6 w-full">
      <h1 className="text-xl sm:text-2xl font-bold">My Bookings</h1>

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

      {bookings.map((order) => {
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
              {/* <p className="font-medium">Patient:</p>
              <p>{order.userName || order.userEmail || "Unknown"}</p> */}
              <p>Status: <span className="font-semibold text-slate-800">{order.bookingStatus || "Booked"}</span></p>
            </div>

            <div className="sm:hidden space-y-4">
              {BOOKING_STEPS.map((step, index) => (
                <div key={index} className="flex items-start gap-3 relative">
                  {index !== BOOKING_STEPS.length - 1 && (
                    <div
                      className={`absolute left-2 top-4 w-[2px] h-full ${index < statusIndex ? "bg-green-500" : "bg-gray-200"}`}
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
                      className={`absolute top-2 left-1/2 w-full h-[2px] ${index < statusIndex ? "bg-green-500" : "bg-gray-200"}`}
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
      })}
    </div>
  );
};

export default Bookings;
