import { NavLink } from "react-router-dom";

const Sidebar = () => {

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Manage Tests", path: "/admin/tests" },
    { name: "Manage Labs", path: "/admin/labs" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <div className="w-64 bg-white shadow h-screen p-5">

      <h2 className="text-xl font-bold mb-6">
        Admin Panel
      </h2>

      <div className="space-y-2">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </div>

    </div>
  );
};

export default Sidebar;