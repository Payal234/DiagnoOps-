import React from 'react';

const Dashboard = () => {
  const superAdminRaw = localStorage.getItem('superAdmin');
  let superAdmin = null;
  try {
    superAdmin = superAdminRaw ? JSON.parse(superAdminRaw) : null;
  } catch {
    superAdmin = null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Welcome{superAdmin?.fullName ? `, ${superAdmin.fullName}` : ''}.
      </p>

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="text-sm text-slate-700">
          <div className="font-semibold">Super Admin Info</div>
          <div className="mt-2 grid gap-1">
            <div>
              <span className="text-slate-500">Email:</span>{' '}
              <span className="font-medium">{superAdmin?.email || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500">Status:</span>{' '}
              <span className="font-medium">Authenticated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
