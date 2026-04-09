import React, { useEffect, useState } from "react";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const adminData = (() => {
    try {
      const raw = localStorage.getItem("labAdmin");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const adminId = adminData?._id;

  useEffect(() => {
    if (!adminId) {
      console.log("Admin ID missing");
      return;
    }

    setLoading(true);
    setError("");

    fetch(`${backendUrl}/api/payment/orders/admin/${adminId}`)
      .then(async (res) => {
        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `API did not return JSON (${res.status}). Received: ${text.slice(0, 80)}`
          );
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || data?.message || "Failed to fetch patients");
        }

        if (data?.success) {
          setPatients(data.orders || []);
          return;
        }

        throw new Error(data?.error || data?.message || "Failed to fetch patients");
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [adminId, backendUrl]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🧑‍⚕️ Patients Details</h1>

      {/* 🔄 Loading */}
      {loading && <p className="text-blue-500">Loading patients...</p>}

      {/* ❌ Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 🚫 No Data */}
      {!loading && patients.length === 0 && !error && (
        <p>No patients found.</p>
      )}

      {/* ✅ Data */}
      {patients.map((order, index) => {
        const user = {
          name: order?.userName,
          email: order?.userEmail,
          contact: order?.userContact,
          age: order?.userAge,
          gender: order?.userGender,
          bloodGroup: order?.userBloodGroup,
          allergies: order?.userAllergies,
        };

        return (
          <div
            key={order?._id || index}
            className="bg-white p-5 rounded-xl shadow mb-4"
          >
            {/* BASIC INFO */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">
                {user?.name || "No Name"}
              </h2>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-sm font-medium">
                {order.bookingStatus || "Booked"}
              </span>
            </div>

            <p>📧 {user?.email || "N/A"}</p>
            <p>📞 {user?.contact || "N/A"}</p>

            {/* PROFILE */}
            <div className="mt-2 text-sm text-gray-600">
              <p>Age: {user?.age || "N/A"}</p>
              <p>Gender: {user?.gender || "N/A"}</p>
              <p>Blood Group: {user?.bloodGroup || "N/A"}</p>
              <p className="text-red-500 font-medium">
                Allergies: {user?.allergies || "None"}
              </p>
            </div>

            {/* TESTS */}
            <div className="mt-3">
              <p className="font-medium">Tests:</p>
              <ul className="list-disc ml-5">
                {order?.items?.length > 0 ? (
                  order.items.map((item, i) => (
                    <li key={i}>{item?.name}</li>
                  ))
                ) : (
                  <li>No tests</li>
                )}
              </ul>
            </div>

            {/* PAYMENT */}
            <div className="mt-3 flex justify-between">
              <span>Total:</span>
              <span className="text-green-600 font-bold">
                ₹{order?.amount || 0}
              </span>
            </div>

            {/* DATE */}
            <p className="text-xs text-gray-400 mt-2">
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "No date"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Patients;