import React, { useEffect, useState } from "react";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
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
  const userId = adminData?._id;

  useEffect(() => {
    if (!userId) {
      console.log("Admin ID missing");
      return;
    }

    setLoading(true);
    setError("");

    // Get admin token for authentication
    const adminToken = (() => {
      try {
        const raw = localStorage.getItem("adminToken");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    const headers = {
      "Content-Type": "application/json",
    };

    if (adminToken) {
      headers["Authorization"] = `Bearer ${adminToken}`;
    }

    // Fetch patients first
    fetch(`${backendUrl}/api/patients`, { headers })
      .then(async (res) => {
        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `Patient API did not return JSON (${res.status}). Received: ${text.slice(0, 80)}`
          );
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch patients");
        }

        if (data?.success) {
          setPatients(data.patients || []);
          
          // After getting patients, fetch their orders
          if (data.patients && data.patients.length > 0) {
            const orderFetches = data.patients.map((patient) => {
              if (patient.orderId) {
                return fetch(
                  `${backendUrl}/api/payments/orders/admin/${userId}`,
                  { headers }
                )
                  .then((res) => res.json())
                  .catch((err) => {
                    console.error("Error fetching orders:", err);
                    return { success: false, orders: [] };
                  });
              }
              return Promise.resolve({ success: false, orders: [] });
            });

            return Promise.all(orderFetches);
          }
          return [];
        } else {
          throw new Error(data?.message || "Failed to fetch patients");
        }
      })
      .then((orderResponses) => {
        // Flatten and merge all orders, removing duplicates by orderId
        const allOrders = [];
        const seenOrderIds = new Set();
        
        orderResponses.forEach((response) => {
          if (response?.success && response?.orders) {
            response.orders.forEach((order) => {
              if (!seenOrderIds.has(order._id)) {
                allOrders.push(order);
                seenOrderIds.add(order._id);
              }
            });
          }
        });
        
        setOrders(allOrders);
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [userId, backendUrl]);

  // Function to get tests booked by a patient
  const getPatientTests = (patient) => {
    if (!patient) return [];
    
    // Match by orderId first (most reliable)
    if (patient.orderId) {
      const orderByIdMatch = orders.find(
        (order) => order.orderId === patient.orderId || order._id === patient.orderId
      );
      if (orderByIdMatch) {
        return [orderByIdMatch];
      }
    }
    
    // Fallback: match by email
    return orders.filter((order) => order.userEmail === patient.email);
  };

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
      {patients.map((patient, index) => {
        const patientTests = getPatientTests(patient);

        return (
          <div
            key={patient?._id || index}
            className="bg-white p-5 rounded-xl shadow mb-4"
          >
            {/* BASIC INFO */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">
                {patient?.name || "No Name"}
              </h2>
              <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium">
                Patient
              </span>
            </div>

            <p>📧 {patient?.email || "N/A"}</p>
            <p>📞 {patient?.phone || "N/A"}</p>
            <p>📍 {patient?.address || "N/A"}</p>

            {/* PROFILE */}
            <div className="mt-2 text-sm text-gray-600">
              <p>Age: {patient?.age || "N/A"}</p>
              <p>Gender: {patient?.gender || "N/A"}</p>
              <p>Blood Group: {patient?.bloodGroup || "N/A"}</p>
              <p className="text-red-500 font-medium">
                Allergies: {patient?.allergies || "None"}
              </p>
            </div>

            {/* BOOKED TESTS */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">
                🧪 Booked Tests ({patientTests.length})
              </h3>
              {patientTests.length === 0 ? (
                <p className="text-gray-500 text-sm">No tests booked yet</p>
              ) : (
                <div className="space-y-2">
                  {patientTests.map((order, orderIdx) => (
                    <div key={order._id || orderIdx} className="bg-white p-3 rounded border-l-4 border-blue-500">
                      <p className="font-medium text-gray-800">
                        📋 Order ID: {order.orderId?.slice(-8) || "N/A"}
                      </p>
                      <div className="mt-2 ml-2 space-y-1">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((test, testIdx) => (
                            <div key={testIdx} className="flex justify-between items-start text-sm">
                              <div>
                                <p className="text-gray-700">
                                  • <span className="font-medium">{test.name || "Unknown Test"}</span>
                                </p>
                                <p className="text-gray-500 ml-4">
                                  Qty: {test.quantity || 1} | ₹{test.price || "N/A"}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No tests in this order</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        📅 {new Date(order.createdAt).toLocaleDateString()} | Status: {order.bookingStatus || order.paymentStatus}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CREATED DATE */}
            <p className="text-xs text-gray-400 mt-2">
              {patient?.createdAt
                ? new Date(patient.createdAt).toLocaleString()
                : "No date"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Patients;