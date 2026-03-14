import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const tests = [
    {
      id: "1",
      name: "Complete Blood Count (CBC)",
      price: 350,
      category: "Blood",
      time: "6 hours",
      description: "Measures red & white blood cells, hemoglobin and platelets.",

      whyNeeded:
        "CBC test helps doctors detect infections, anemia, immune system disorders and blood related diseases.",

      preparation:
        "Usually no fasting is required. Drink water and avoid heavy meals before the test.",

      precautions:
        "Inform your doctor if you are taking any medicines or supplements.",

      procedure:
        "A small blood sample is taken from a vein in your arm using a sterile needle.",

      resultMeaning:
        "The report shows levels of RBC, WBC, hemoglobin and platelets which help diagnose health conditions.",
    },

    {
      id: "2",
      name: "Lipid Profile",
      price: 600,
      category: "Blood",
      time: "12 hours",
      description: "Checks cholesterol levels including HDL and LDL.",

      whyNeeded:
        "Used to evaluate risk of heart disease and monitor cholesterol levels.",

      preparation:
        "Fasting for 9–12 hours is usually required before the test.",

      precautions:
        "Avoid fatty foods and alcohol before the test.",

      procedure:
        "A blood sample is collected from the arm for cholesterol analysis.",

      resultMeaning:
        "Shows levels of total cholesterol, HDL, LDL and triglycerides.",
    },

    {
      id: "3",
      name: "Urine Routine & Microscopy",
      price: 200,
      category: "Urine",
      time: "4 hours",
      description: "Basic urine analysis for infections and kidney issues.",

      whyNeeded:
        "Helps detect urinary tract infections, kidney problems and metabolic disorders.",

      preparation:
        "Collect mid-stream urine sample in a sterile container.",

      precautions:
        "Avoid contamination of the urine sample.",

      procedure:
        "Urine sample is tested under microscope and chemically analyzed.",

      resultMeaning:
        "Shows presence of bacteria, proteins, sugar and other substances.",
    },

    {
      id: "4",
      name: "Thyroid Panel",
      price: 800,
      category: "Blood",
      time: "24 hours",
      description: "Comprehensive thyroid function assessment.",

      whyNeeded:
        "Used to diagnose thyroid disorders like hypothyroidism and hyperthyroidism.",

      preparation:
        "Usually no fasting required unless advised by doctor.",

      precautions:
        "Inform doctor about thyroid medications before test.",

      procedure:
        "Blood sample collected and analyzed for T3, T4 and TSH levels.",

      resultMeaning:
        "Abnormal levels may indicate thyroid gland problems.",
    },

    {
      id: "5",
      name: "Full Body Checkup",
      price: 2499,
      category: "Packages",
      time: "48 hours",
      description: "Complete health check package for overall health screening.",

      whyNeeded:
        "Helps detect early signs of diseases and monitor overall health.",

      preparation:
        "12 hour fasting recommended before the test.",

      precautions:
        "Avoid alcohol and heavy food before test day.",

      procedure:
        "Includes multiple blood, urine and health screening tests.",

      resultMeaning:
        "Provides a complete overview of your health condition.",
    },
  ];

  const test = tests.find((t) => t.id === id);

  if (!test) {
    return <div className="p-6 text-center">Test not found</div>;
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