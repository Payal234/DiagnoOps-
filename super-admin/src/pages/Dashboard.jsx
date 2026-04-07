import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [earnings, setEarnings] = useState({
    totalPlatformFee: 0,
    totalAmount: 0,
    orderCount: 0,
    loading: true,
  });

  const superAdminRaw = localStorage.getItem('superAdmin');
  let superAdmin = null;
  try {
    superAdmin = superAdminRaw ? JSON.parse(superAdminRaw) : null;
  } catch {
    superAdmin = null;
  }

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/payment/earnings/superadmin');
        const data = await res.json();

        if (res.ok && data.success) {
          setEarnings({ ...data.earnings, loading: false });
        } else {
          setEarnings((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        setEarnings((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Welcome{superAdmin?.fullName ? `, ${superAdmin.fullName}` : ''}.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">Total platform earnings</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">₹{earnings.totalPlatformFee.toLocaleString()}</div>
          <div className="mt-2 text-sm text-slate-500">Collected from orders</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">All order value</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">₹{earnings.totalAmount.toLocaleString()}</div>
          <div className="mt-2 text-sm text-slate-500">Gross payments received</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">Paid orders</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{earnings.orderCount}</div>
          <div className="mt-2 text-sm text-slate-500">Successful payments</div>
        </div>
      </div>

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
