const Dashboard = () => {
  let labAdmin = null;
  try {
    labAdmin = JSON.parse(localStorage.getItem("labAdmin") || "null");
  } catch {
    labAdmin = null;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Use the navigation menu to manage lab tests. Any tests you add will show up in the public frontend.
        </p>

        {labAdmin && (
          <div className="mt-5 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Logged in as</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{labAdmin.ownerName || "Lab Admin"}</p>
            <p className="text-sm text-slate-600">{labAdmin.labName ? `${labAdmin.labName} • ` : ""}{labAdmin.email}</p>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Quick links</h2>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>&#8226; Manage Tests</li>
              <li>&#8226; View Frontend Lab Tests</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Tips</h2>
            <p className="mt-2 text-gray-600">
              When you add a new test, it becomes available immediately on the frontend under the Tests page. Use the "Lab" field to group tests by lab if you are using lab-specific pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
