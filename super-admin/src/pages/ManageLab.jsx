import React, { useEffect, useState } from "react";
import axios from "axios";

const StatusBadge = ({ status }) => {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
    pending:  "bg-amber-50 text-amber-600 border border-amber-200",
  };
  const dots = {
    approved: "bg-emerald-500",
    rejected:  "bg-red-500",
    pending:   "bg-amber-500",
  };
  const s = status || "pending";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[s] || styles.pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[s] || dots.pending}`} />
      {s}
    </span>
  );
};

const StatCard = ({ label, count, color }) => {
  const colors = {
    approved: { bg: "bg-emerald-50", border: "border-emerald-100", num: "text-emerald-700", dot: "bg-emerald-500" },
    rejected:  { bg: "bg-red-50",     border: "border-red-100",     num: "text-red-600",     dot: "bg-red-500" },
    pending:   { bg: "bg-amber-50",   border: "border-amber-100",   num: "text-amber-600",   dot: "bg-amber-500" },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`w-3 h-3 rounded-full ${c.dot} shrink-0`} />
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-3xl font-bold ${c.num}`}>{count}</p>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
  </div>
);

const getOwnerDisplayName = (lab) => {
  if (!lab) return "";
  const direct = (lab.ownerName || lab.name || "").toString().trim();
  if (direct) return direct;
  const emailPrefix = (lab.email || "").toString().split("@")[0].trim();
  return emailPrefix || "";
};

const ManageLab = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchLabs(); }, []);

  const fetchLabs = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/labadmin/all", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = res?.data;
      const labsArray = Array.isArray(data) ? data : Array.isArray(data?.labs) ? data.labs : [];
      setLabs(labsArray);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.response?.status === 401 || err?.response?.status === 403
          ? "Unauthorized. Please login again."
          : "Failed to load lab requests.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/labadmin/status/${id}`,
        { status },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      fetchLabs();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const approved = labs.filter((l) => l.status === "approved").length;
  const rejected = labs.filter((l) => l.status === "rejected").length;
  const pending  = labs.filter((l) => !l.status || l.status === "pending").length;

  const filtered = filter === "all" ? labs : labs.filter((l) =>
    filter === "pending" ? (!l.status || l.status === "pending") : l.status === filter
  );

  const filters = ["all", "approved", "pending", "rejected"];

  return (
    <div className="w-full min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Labs</h1>
        </div>
        <p className="text-sm text-slate-400 pl-12">Review and approve lab registration requests</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Approved" count={approved} color="approved" />
        <StatCard label="Pending"  count={pending}  color="pending"  />
        <StatCard label="Rejected" count={rejected} color="rejected" />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
              ${filter === f
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {f}
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs font-bold
              ${filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {f === "all" ? labs.length
                : f === "approved" ? approved
                : f === "rejected" ? rejected
                : pending}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <svg className="animate-spin w-8 h-8 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-sm text-slate-400">Loading lab requests...</p>
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-500">No {filter === "all" ? "" : filter} labs found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((lab) => (
            <div key={lab._id}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

              {/* Card top stripe by status */}
              <div className={`h-1 w-full ${
                lab.status === "approved" ? "bg-emerald-400"
                : lab.status === "rejected" ? "bg-red-400"
                : "bg-amber-400"}`} />

              <div className="p-5 sm:p-6">

                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-base font-bold text-slate-600">
                        {(lab.labName || lab.name || "L").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base leading-tight">{lab.labName || "—"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">ID: {lab._id?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <StatusBadge status={lab.status} />
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 pb-5 border-b border-slate-100">
                  <Field label="Owner Name"     value={getOwnerDisplayName(lab)} />
                  <Field label="Email"          value={lab.email} />
                  <Field label="Mobile"         value={lab.mobile} />
                  <Field label="License No."    value={lab.licenseNumber} />
                  <Field label="Experience"     value={lab.experience ? `${lab.experience} yrs` : "—"} />
                  <Field label="Opening Day"    value={lab.openingDay} />
                  <Field label="Opening Time"   value={lab.openingTime} />
                  <Field label="Closing Time"   value={lab.closingTime} />
                  {lab.address && (
                    <div className="col-span-2 sm:col-span-3 lg:col-span-4">
                      <Field label="Address" value={lab.address} />
                    </div>
                  )}
                </div>

                {/* Document & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                  {/* View Document */}
                  <a href={lab.licenseFile} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 px-3 py-2 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    View License Document
                  </a>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      disabled={lab.status === "approved" || updatingId === lab._id}
                      onClick={() => updateStatus(lab._id, "approved")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                        ${lab.status === "approved"
                          ? "bg-emerald-50 text-emerald-400 border border-emerald-100 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"}`}>
                      {updatingId === lab._id ? (
                        <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      Approve
                    </button>

                    <button
                      disabled={lab.status === "rejected" || updatingId === lab._id}
                      onClick={() => updateStatus(lab._id, "rejected")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                        ${lab.status === "rejected"
                          ? "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Reject
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageLab;