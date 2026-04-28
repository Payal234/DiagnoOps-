import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://diagnoops-backend.vercel.app/api/tests/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch test details");
        }
        const data = await res.json();
        setTest(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading test details...</div>
    );
  }

  if (error || !test) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Test not found"}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white shadow"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {test.name}
        </h1>

      </div>

      {/* Main Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">

        <div className="flex justify-between">
          <span className="text-teal-600 font-bold text-xl">
            ₹{test.price}
          </span>

          <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm">
            {test.category}
          </span>
        </div>

        <p className="text-gray-600">{test.description}</p>

        <p className="text-sm text-gray-500">
          Result Time: {test.time}
        </p>

      </div>

      {/* Sections */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Why this test is needed</h2>
        <p className="text-gray-600">{test.whyNeeded}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Preparation</h2>
        <p className="text-gray-600">{test.preparation}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Precautions</h2>
        <p className="text-gray-600">{test.precautions}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Procedure</h2>
        <p className="text-gray-600">{test.procedure}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Result Meaning</h2>
        <p className="text-gray-600">{test.resultMeaning}</p>
      </div>

    </div>
  );
};

export default TestDetails;