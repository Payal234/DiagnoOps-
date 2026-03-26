import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ContactUs from "../components/ContactUs";

const LabInfo = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [labInfo, setLabInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchLab = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${API_BASE}/api/labadmin/public/${encodeURIComponent(labId || "")}`
        );

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `Expected JSON from API but got ${contentType || "unknown"}. ` +
              `Is backend running on ${API_BASE}? Response: ${text.slice(0, 80)}...`
          );
        }

        const data = await res.json();

        const lab = data?.lab;
        if (!res.ok || !lab) throw new Error(data?.message || "Lab not found");

        setLabInfo({
          id: labId,
          name: lab.labName || labId,
          slogan: "Leading the way in diagnostic excellence",
          about:
            "This lab has been providing high quality diagnostics. Our state-of-the-art equipment ensures accurate results.",
          whyChooseUs:
            "Experienced technicians, fast turnaround time, and a patient-centric approach make us a top choice.",
          experience:
            lab.experience === 0 || lab.experience ? `${lab.experience} years` : "—",
          patients: "—",
          address: lab.address || "—",
          image: lab.labPhoto || "/images/Lab1.png",
        });
      } catch (e) {
        setError(e?.message || "Failed to load lab information");
        setLabInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLab();
  }, [labId]);

  if (loading) {
    return <div className="p-6 text-center">Loading lab information...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!labInfo) {
    return (
      <div className="p-6 text-center">Loading lab information...</div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        <ArrowLeft size={18}  /> Back
      </button>

      <div className="text-center">
        <h1 className="text-3xl font-bold">{labInfo.name}</h1>
        <p className="text-lg text-teal-600 mt-2">{labInfo.slogan}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">About Us</h2>
          <p className="mt-2 text-gray-700">{labInfo.about}</p>
        </div>
        <div className="flex-1">
          <img
            src={labInfo.image}
            alt={labInfo.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Why Choose Us</h2>
        <p className="text-gray-700">{labInfo.whyChooseUs}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-500">Experience</p>
            <p className="text-lg font-bold">{labInfo.experience}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-500">Happy Patients</p>
            <p className="text-lg font-bold">{labInfo.patients}</p>
          </div>
        </div>
      </section>

     
     <ContactUs/>
    </div>
  );
};

export default LabInfo;
