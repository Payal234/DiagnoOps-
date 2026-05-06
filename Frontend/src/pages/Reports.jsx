import React, { useState, useEffect } from "react";
import { Eye, Download, FileText } from "lucide-react";

const statusStyles = {
  Normal: "bg-green-100 text-green-700",
  Abnormal: "bg-red-100 text-red-700",
  Borderline: "bg-yellow-100 text-yellow-700",
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Reports & Records
        </h1>
        <p className="text-gray-500 mt-1 mb-6">
          View and download your medical reports
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mb-3"></div>
              <p className="text-gray-600">Loading your reports...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && !error && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No reports available yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Reports will appear here once your tests are completed and reviewed
            </p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && reports.length > 0 && (
          <div className="hidden md:block rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4">Report</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {report.name}
                        </p>
                        <p className="text-sm text-gray-500">{report.orderId?.slice(-6) || report.id.slice(-6)}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{report.date}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[report.status]}`}
                      >
                        {report.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {report.doctor}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-6">
                        <button
                          onClick={() => handleView(report.file)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button
                          onClick={() => handleDownload(report.file, `Report-${report.orderId || report.id}.pdf`)}
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          <Download size={16} />
                          PDF
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
              <div key={report.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {report.name}
                        </h3>
                        <p className="text-sm text-gray-500">{report.orderId?.slice(-6) || report.id.slice(-6)}</p>
                      </div>

                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[report.status]}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Date:</span> {report.date}
                      </p>
                      <p>
                        <span className="font-medium">Doctor:</span> {report.doctor}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-6">
                      <button
                        onClick={() => handleView(report.file)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        onClick={() => handleDownload(report.file, `Report-${report.orderId || report.id}.pdf`)}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        <Download size={16} />
                        PDF
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