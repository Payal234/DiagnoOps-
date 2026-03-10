import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Labdetails = () => {
  const navigate = useNavigate();

  const labsData = [
    {
      _id: "1",
      name: "City Diagnostic Lab",
      ownerName: "Dr. Sharma",
      image: "/images/Lab1.png", // served from public/ folder
      location: "Nagpur",
      openTime: "8:00 AM",
      closeTime: "8:00 PM",
      days: "Mon - Sat",
      experience: "15 years",
    },
    {
      _id: "2",
      name: "HealthCare Pathology",
      ownerName: "Dr. Mehta",
      image: "/images/Lab1.png",
      location: "Pune",
      openTime: "7:00 AM",
      closeTime: "9:00 PM",
      days: "Mon - Sat",
      experience: "10 years",
    },
    {
      _id: "3",
      name: "LifeLine Diagnostics",
      ownerName: "Dr. Patel",
      image: "/images/Lab1.png",
      location: "Mumbai",
      openTime: "9:00 AM",
      closeTime: "7:00 PM",
      days: "Mon - Sat",
      experience: "20 years",
    },
  ];


  return (
    <div className="p-4 sm:p-6">
      {/* back to dashboard */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        <ArrowLeft size={18}  /> Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {labsData.map((lab) => (
        <div
          key={lab._id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            src={lab.image}
            alt={lab.name}
            className="w-full h-40 sm:h-48 object-cover"
          />

          <div className="p-3 sm:p-4">
            <h2 className="text-lg font-semibold">{lab.name}</h2>

            <p className="text-sm text-gray-600">
              Owner: {lab.ownerName}
            </p>

            <p className="text-sm text-gray-600">
              Location: {lab.location}
            </p>

            <p className="text-sm text-gray-600">
              Time: {lab.openTime} - {lab.closeTime}
            </p>

            <p className="text-sm text-gray-600">
              Days: {lab.days}
            </p>

            <p className="text-sm text-gray-600">
              Experience: {lab.experience}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/lab-tests/${lab._id}`)}
                className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer"
              >
                Visit
              </button>

              <button
                onClick={() => navigate(`/lab-details/${lab._id}`)}
                className="px-3 py-1 bg-gray-800 text-white rounded cursor-pointer"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Labdetails;