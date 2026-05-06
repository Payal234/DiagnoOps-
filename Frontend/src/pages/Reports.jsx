import React, { useState, useEffect } from "react";
import { Eye, Download, FileText, FileCheck, AlertCircle } from "lucide-react";

const statusStyles = {
  Normal: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Abnormal: "bg-rose-100 text-rose-700 border border-rose-200",
  Borderline: "bg-amber-100 text-amber-700 border border-amber-200",
};

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        // Get user ID from localStorage
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        const userId = user?._id || user?.id;

        if (!userId) {
          setError("Please login to view reports");
          setLoading(false);
          return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://diagnoops-backend.vercel.app";
        const response = await fetch(`${backendUrl}/api/payment/orders/user/${userId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        const orders = Array.isArray(data.orders) ? data.orders : [];

        // Filter only orders with reports
        const reportsData = orders
          .filter((order) => order.report?.fileUrl)
          .map((order) => ({
            id: order._id,
            name: order.items?.[0]?.name || "Lab Test Report",
            date: new Date(order.report?.uploadedAt || order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            status: order.report?.status || "Normal",
            doctor: order.report?.doctorName || "Unknown",
            file: order.report?.fileUrl,
            orderId: order.orderId,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setReports(reportsData);
      } catch (err) {
        setError(err.message || "Failed to fetch reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleView = (file) => {
    window.open(file, "_blank");
  };

  const handleDownload = (file, fileName) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = fileName || "report";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <FileCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Reports & Records</h1>
              <p className="text-slate-500 text-sm mt-1">Your medical test results and reports</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full mb-4"></div>
              <p className="text-slate-600 font-medium">Loading your reports...</p>
              <p className="text-slate-400 text-sm mt-1">Please wait</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-rose-700 mb-8 flex items-start gap-3">
            <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error Loading Reports</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && !error && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
            <FileText className="h-20 w-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-700 font-semibold text-lg">No reports available yet</p>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Reports will appear here once your lab tests are completed and reviewed by the doctor
            </p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && reports.length > 0 && (
          <div className="hidden md:block rounded-2xl shadow-lg overflow-hidden border border-slate-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                <tr>
                  <th className="px-6 py-5 font-bold text-slate-700 text-sm uppercase tracking-wider">Report</th>
                  <th className="px-6 py-5 font-bold text-slate-700 text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-5 font-bold text-slate-700 text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 font-bold text-slate-700 text-sm uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-5 font-bold text-slate-700 text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report, idx) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition duration-200">
                    <td className="px-6 py-5 flex items-center gap-4">
                      <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-3 rounded-xl shadow-sm">
                        <FileText className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{report.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Ord: {report.orderId?.slice(-6) || report.id.slice(-6)}</p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-700">{report.date}</span>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full ${statusStyles[report.status]}`}>
                        ✓ {report.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-slate-700">{report.doctor}</p>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleView(report.file)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-sm font-semibold rounded-lg transition duration-200 border border-blue-200"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        <button
                          onClick={() => handleDownload(report.file, `Report-${report.orderId || report.id}.pdf`)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 text-sm font-semibold rounded-lg transition duration-200 border border-emerald-200"
                        >
                          <Download size={16} />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && reports.length > 0 && (
          <div className="md:hidden space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 hover:shadow-lg transition duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-3 rounded-xl shadow-sm flex-shrink-0">
                    <FileText className="h-6 w-6 text-cyan-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm">{report.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Order #{report.orderId?.slice(-6) || report.id.slice(-6)}</p>
                      </div>
                      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full flex-shrink-0 ${statusStyles[report.status]}`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">📅</span>
                        <span className="text-slate-700 font-medium">{report.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">👨‍⚕️</span>
                        <span className="text-slate-700 font-medium">{report.doctor}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => handleView(report.file)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition duration-200 border border-blue-200"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        onClick={() => handleDownload(report.file, `Report-${report.orderId || report.id}.pdf`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-lg transition duration-200 border border-emerald-200"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}