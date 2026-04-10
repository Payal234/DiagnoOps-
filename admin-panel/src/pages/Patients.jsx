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

    fetch(`${backendUrl}/api/patients`, { headers })
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
          throw new Error(data?.message || "Failed to fetch patients");
        }

        if (data?.success) {
          setPatients(data.patients || []);
          return;
        }

        throw new Error(data?.message || "Failed to fetch patients");
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [userId, backendUrl]);

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