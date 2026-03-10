import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ContactUs from "../components/ContactUs";

const LabInfo = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [labInfo, setLabInfo] = useState(null);

  useEffect(() => {
    // TODO: replace with real API call
    // fetch(`/api/labs/${labId}`)
    //   .then(res => res.json())
    //   .then(data => setLabInfo(data))
    //   .catch(console.error);

    // derive a real-looking name for now; replace with backend data later
    const names = {
      "1": "City Diagnostic Lab",
      "2": "HealthCare Pathology",
      "3": "LifeLine Diagnostics",
    };
    setLabInfo({
      id: labId,
      name: names[labId] || `Lab ${labId}`,
      slogan: "Leading the way in diagnostic excellence",
      about:
        "This lab has been providing high quality diagnostics for over 20 years. Our state-of-the-art equipment ensures accurate results.",
      whyChooseUs:
        "Experienced technicians, fast turnaround time, and a patient-centric approach make us the top choice in the region.",
      experience: "20 years",
      patients: "50,000+",
      address: "123 Health St, City",
      image: "/images/Lab1.png",
    });
  }, [labId]);

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
