import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";

// If you don't yet have a pages directory, simple placeholders
import Dashboard from "./pages/Dashboard";
// import Tests from "./pages/Tests";
import Reports from "./pages/Reports";
import Bookings from "./pages/Bookings";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import LabTests from "./pages/LabTests";
import LabInfo from "./pages/LabInfo";
import Footer from "./layout/Footer";
import LabDetails from "./pages/Labdetails";
import TestDetails from "./pages/TestDetails";


function App() {
  return (
      <div className="flex">

        {/* Sidebar stays fixed height 100% */}
        <Sidebar />

        {/* Main content wraps with min-h-screen so entire page scrolls */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* Topbar */}
          <Topbar />

          {/* Pages - allow page to scroll naturally */}
          <div className="p-6 bg-gray-50 flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/tests" element={<Tests />} /> */}
              {/* labId param allows visiting tests for a specific lab */}
              <Route path="/lab-tests/:labId" element={<LabTests />} />
              <Route path="/labs" element={<LabDetails/>}/>
              <Route path="/lab-details/:labId" element={<LabInfo />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />


              {/* Test Details Page */}
           <Route path="/test-details/:id" element={<TestDetails />} />
      
            </Routes>
          </div>

          {/* footer shown at bottom after content */}
          <Footer />
        </div>

      </div>
  );
}

export default App;