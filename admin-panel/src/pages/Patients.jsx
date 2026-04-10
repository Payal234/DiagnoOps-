import React, { useEffect, useState, useRef } from "react";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

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

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

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

    // Fetch patients and orders in parallel - ONE API call each
    Promise.all([
      fetch(`${backendUrl}/api/patients`, { headers, signal }),
      fetch(`${backendUrl}/api/payment/orders/admin/${userId}`, { headers, signal }),
    ])
      .then(async (responses) => {
        // Handle patients response
        const patientRes = responses[0];
        const contentType = patientRes.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await patientRes.text();
          throw new Error(
            `Patient API did not return JSON (${patientRes.status}). Received: ${text.slice(0, 80)}`
          );
        }

        const patientData = await patientRes.json();
        if (!patientRes.ok) {
          throw new Error(patientData?.message || "Failed to fetch patients");
        }

        if (!patientData?.success) {
          throw new Error(patientData?.message || "Failed to fetch patients");
        }

        const patientsFromAPI = patientData.patients || [];
        setPatients(patientsFromAPI);
        console.log("Patients loaded:", patientsFromAPI);

        // Handle orders response
        const ordersRes = responses[1];
        const ordersContentType = ordersRes.headers.get("content-type") || "";

        if (ordersContentType.includes("application/json")) {
          const ordersData = await ordersRes.json();
          console.log("Orders API Response:", ordersData);
          
          if (ordersData?.success && ordersData?.orders) {
            const ordersFromAPI = ordersData.orders || [];
            setOrders(ordersFromAPI);
            console.log("Orders loaded:", ordersFromAPI);
            
            // Debug: Log matching for each patient
            patientsFromAPI.forEach(patient => {
              const matched = ordersFromAPI.filter(order => 
                order.orderId === patient.orderId || 
                order.userEmail === patient.email
              );
              console.log(`Patient ${patient.name} (${patient.email}, orderId: ${patient.orderId}):`, matched.length, "orders matched");
            });
          } else {
            setOrders([]);
            console.log("No orders received");
          }
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch cancelled");
        } else {
          console.error("Error fetching data:", err);
          setError(err.message || "Something went wrong");
        }
      })
      .finally(() => setLoading(false));

    // Cleanup function to cancel request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId]);

  // Function to get tests booked by a patient
  const getPatientTests = (patient) => {
    if (!patient || orders.length === 0) return [];
    
    console.log(`Matching tests for patient: ${patient.name} (email: ${patient.email}, orderId: ${patient.orderId})`);
    
    // First try: Match by orderId (Razorpay order ID)
    if (patient.orderId) {
      const orderByIdMatches = orders.filter(
        (order) => order?.orderId === patient.orderId
      );
      if (orderByIdMatches.length > 0) {
        console.log(`Found ${orderByIdMatches.length} orders by orderId`);
        return orderByIdMatches;
      }
    }
    
    // Second try: Match by email
    const orderByEmailMatches = orders.filter(
      (order) => order?.userEmail?.toLowerCase() === patient.email?.toLowerCase()
    );
    if (orderByEmailMatches.length > 0) {
      console.log(`Found ${orderByEmailMatches.length} orders by email`);
      return orderByEmailMatches;
    }
    
    console.log("No orders found for this patient");
    return [];
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