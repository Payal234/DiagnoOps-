import { useEffect, useState } from "react";
import HeroDiagno from "../components/dashboard/HeroDiagno"
import AboutDiagno from "../components/dashboard/AboutDiagno";
import WhyDiagno from "../components/dashboard/WhyDiagno";
import HowItWorks from "../components/dashboard/HowItWorks";


const Dashboard = () => {

  const [userName, setUserName] = useState("");
// some inspirational slogans to show at top
  const slogans = [
    "Trusted Diagnostics, Trusted Care",
    "Your Health, Our Priority",
    "Accuracy in Every Report",
  ];
  // ✅ Get logged in user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (e) {
        // not JSON, maybe just a name
        setUserName(stored);
      }
    }
  }, []);

  // ✅ Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

 
 
  return (
    <div className="w-full min-h-screen bg-gray-50">
      
      {/* Main Content Wrapper */}
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2 space-y-6">

        {/* Greeting Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's your health overview
          </p>
        </div>
 {/* slogan area: single line */}
      <div className="mb-4 sm:mb-6 text-center">
        <p className="text-base sm:text-lg font-semibold text-teal-600 break-words">
          {slogans.join(" — ")}
        </p>
      </div>
      <HeroDiagno/>
<AboutDiagno/>
<WhyDiagno/>
<HowItWorks/>
     

      </div>
    </div>
  );
};

export default Dashboard;