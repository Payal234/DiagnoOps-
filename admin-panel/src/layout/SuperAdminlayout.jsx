import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const SuperAdminLayout = () => {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-6 bg-gray-50 min-h-screen">

        <div className="mb-4 text-lg font-semibold">
          Super Admin Panel
        </div>

        <Outlet />

      </div>

    </div>
  );
};

export default SuperAdminLayout;