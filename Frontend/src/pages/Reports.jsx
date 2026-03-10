import React from "react";
import { Eye, Download, FileText } from "lucide-react";

const reports = [
  {
    id: "RPT-001",
    name: "Complete Blood Count",
    date: "Feb 28, 2026",
    status: "Normal",
    doctor: "Dr. Sharma",
    file: "/reports/RPT-001.pdf",
  },
  {
    id: "RPT-002",
    name: "Lipid Profile",
    date: "Feb 22, 2026",
    status: "Abnormal",
    doctor: "Dr. Patel",
    file: "/reports/RPT-002.pdf",
  },
  {
    id: "RPT-003",
    name: "Thyroid Panel",
    date: "Feb 15, 2026",
    status: "Normal",
    doctor: "Dr. Sharma",
    file: "/reports/RPT-003.pdf",
  },
  {
    id: "RPT-004",
    name: "Full Body Checkup",
    date: "Feb 10, 2026",
    status: "Normal",
    doctor: "Dr. Gupta",
    file: "/reports/RPT-004.pdf",
  },
  {
    id: "RPT-005",
    name: "HbA1c",
    date: "Jan 28, 2026",
    status: "Borderline",
    doctor: "Dr. Patel",
    file: "/reports/RPT-005.pdf",
  },
];

const statusStyles = {
  Normal: "bg-green-100 text-green-700",
  Abnormal: "bg-red-100 text-red-700",
  Borderline: "bg-yellow-100 text-yellow-700",
};

export default function Reports() {
  const handleView = (file) => {
    window.open(file, "_blank"); // Open in new tab
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = file.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Reports & Records
        </h1>
        <p className="text-gray-500 mt-1 mb-6">
          View and download your medical reports
        </p>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className=" text-gray-600 text-sm uppercase">
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
                      <p className="text-sm text-gray-500">{report.id}</p>
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
                        onClick={() => handleDownload(report.file)}
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

        {/* Mobile Cards */}
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
                      <p className="text-sm text-gray-500">{report.id}</p>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[report.status]}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {report.date}
                    </p>
                    <p>
                      <span className="font-medium">Doctor:</span>{" "}
                      {report.doctor}
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
                      onClick={() => handleDownload(report.file)}
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
      </div>
    </div>
  );
}