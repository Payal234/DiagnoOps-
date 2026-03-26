import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Labdetails = () => {
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5000";

  const [labsData, setLabsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/api/labadmin/public`);
        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `Expected JSON from API but got ${contentType || "unknown"}. ` +
              `Is backend running on ${API_BASE}? Response: ${text.slice(0, 80)}...`
          );
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to load labs");
        }

        const labs = Array.isArray(data?.labs) ? data.labs : [];
        setLabsData(labs);
      } catch (e) {
        setError(e?.message || "Failed to load labs");
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);


  return (
    <div className="p-4 sm:p-6">
      {/* back to dashboard */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        <ArrowLeft size={18}  /> Back
      </button>
      
      {loading ? (
        <div className="mt-6 text-gray-600">Loading labs...</div>
      ) : error ? (
        <div className="mt-6 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {labsData.map((lab) => (
        <div
          key={lab._id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            src={lab.labPhoto || "/images/Lab1.png"}
            alt={lab.labName}
            className="w-full h-40 sm:h-48 object-cover"
          />

          <div className="p-3 sm:p-4">
            <h2 className="text-lg font-semibold">{lab.labName}</h2>

            <p className="text-sm text-gray-600">
              Owner: {lab.ownerName}
            </p>

            <p className="text-sm text-gray-600">
              Address: {lab.address || "—"}
            </p>

            <p className="text-sm text-gray-600">
              Time: {lab.openingTime || "—"} - {lab.closingTime || "—"}
            </p>

            <p className="text-sm text-gray-600">
              Days: {lab.openingDay || "—"}
            </p>

            <p className="text-sm text-gray-600">
              Experience: {lab.experience === 0 || lab.experience ? `${lab.experience} years` : "—"}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/lab-tests/${encodeURIComponent(lab.labName)}`)}
                className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer"
              >
                Visit
              </button>

              <button
                onClick={() => navigate(`/lab-details/${encodeURIComponent(lab.labName)}`)}
                className="px-3 py-1 bg-gray-800 text-white rounded cursor-pointer"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
        ))}
      </div>
      )}
  </div>
  );
};

export default Labdetails;