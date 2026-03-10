import { useState } from "react";

const Bookings = () => {
  const [bookings] = useState([
    {
      id: "BK-001",
      name: "Complete Blood Count",
      date: "Feb 28, 2026",
      price: 500,
      statusIndex: 2,
    },
    {
      id: "BK-002",
      name: "Lipid Profile",
      date: "Feb 27, 2026",
      price: 800,
      statusIndex: 4,
    },
  ]);

  const BOOKING_STEPS = [
    "Booked",
    "Sample Collected",
    "Processing",
    "Report Ready",
    "Approved",
  ];

  return (
    <div className="px-3 sm:px-6 py-6 space-y-6 w-full">
      <h1 className="text-xl sm:text-2xl font-bold">
        My Bookings
      </h1>

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white p-4 sm:p-5 rounded-xl shadow w-full"
        >
          {/* Header */}
          <div className="flex justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h3 className="font-semibold text-sm sm:text-base">
                {booking.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {booking.id} • {booking.date}
              </p>
            </div>

            <span className="font-bold text-blue-600 text-sm sm:text-base">
              ₹{booking.price}
            </span>
          </div>

          {/* ========== MOBILE VIEW (Vertical Timeline) ========== */}
          <div className="sm:hidden space-y-4">
            {BOOKING_STEPS.map((step, index) => (
              <div key={index} className="flex items-start gap-3 relative">

                {/* Line */}
                {index !== BOOKING_STEPS.length - 1 && (
                  <div
                    className={`absolute left-2 top-4 w-[2px] h-full ${
                      index < booking.statusIndex
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}

                {/* Dot */}
                <div
                  className={`w-4 h-4 rounded-full mt-1 ${
                    index <= booking.statusIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>

                {/* Label */}
                <p
                  className={`text-sm ${
                    index <= booking.statusIndex
                      ? "text-green-600 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* ========== DESKTOP VIEW (Horizontal) ========== */}
          <div className="hidden sm:flex items-center justify-between relative">
            {BOOKING_STEPS.map((step, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* Line */}
                {index !== BOOKING_STEPS.length - 1 && (
                  <div
                    className={`absolute top-2 left-1/2 w-full h-[2px] ${
                      index < booking.statusIndex
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}

                {/* Dot */}
                <div
                  className={`w-4 h-4 rounded-full z-10 ${
                    index <= booking.statusIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>

                {/* Label */}
                <p
                  className={`text-xs mt-2 ${
                    index <= booking.statusIndex
                      ? "text-green-600 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
};

export default Bookings;