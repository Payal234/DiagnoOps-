import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [documents, setDocuments] = useState({ licenseFile: "", labPhoto: "" });
  const [labPhotoFile, setLabPhotoFile] = useState(null);

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    mobile: "",
    labName: "",
    licenseNumber: "",
    experience: "",
    openingDay: "",
    openingTime: "",
    closingTime: "",
    address: "",
    slogan: "",
    about: "",
    whyChooseUs: "",
    happyPatients: "",
  });

  const [initialSnapshot, setInitialSnapshot] = useState(null);

  const token = localStorage.getItem("labAdminToken");

  const normalizeAssetUrl = (value) => {
    if (!value) return "";
    const v = String(value).trim().replace(/\\/g, "/");
    if (!v) return "";
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    if (v.startsWith("/")) return `${API_BASE}${v}`;
    return `${API_BASE}/${v}`;
  };

  const loadProfile = async () => {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/labadmin/me`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const labAdmin = res.data?.labAdmin;
      if (!labAdmin) throw new Error("Profile not found");

      const nextForm = {
        ownerName: labAdmin.ownerName || labAdmin.name || "",
        email: labAdmin.email || "",
        mobile: labAdmin.mobile || "",
        labName: labAdmin.labName || "",
        licenseNumber: labAdmin.licenseNumber || "",
        experience:
          labAdmin.experience === 0 || labAdmin.experience
            ? String(labAdmin.experience)
            : "",
        openingDay: labAdmin.openingDay || "",
        openingTime: labAdmin.openingTime || "",
        closingTime: labAdmin.closingTime || "",
        address: labAdmin.address || "",
        slogan: labAdmin.slogan || "",
        about: labAdmin.about || "",
        whyChooseUs: labAdmin.whyChooseUs || "",
        happyPatients:
          labAdmin.happyPatients === 0 || labAdmin.happyPatients
            ? String(labAdmin.happyPatients)
            : "",
      };

      setForm(nextForm);
      setInitialSnapshot(nextForm);
      setIsEditing(false);
      setLabPhotoFile(null);
      setDocuments({
        licenseFile: normalizeAssetUrl(labAdmin.licenseFile || ""),
        labPhoto: normalizeAssetUrl(labAdmin.labPhoto || ""),
      });

      localStorage.setItem("labAdmin", JSON.stringify(labAdmin));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCancel = () => {
    if (initialSnapshot) setForm(initialSnapshot);
    setIsEditing(false);
    setLabPhotoFile(null);
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const baseHeaders = { Authorization: token ? `Bearer ${token}` : "" };

      const payload = {
        ownerName: form.ownerName,
        mobile: form.mobile,
        labName: form.labName,
        licenseNumber: form.licenseNumber,
        experience: form.experience,
        openingDay: form.openingDay,
        openingTime: form.openingTime,
        closingTime: form.closingTime,
        address: form.address,
        slogan: form.slogan,
        about: form.about,
        whyChooseUs: form.whyChooseUs,
        happyPatients: form.happyPatients,
      };

      const res = labPhotoFile
        ? await axios.put(
            `${API_BASE}/api/labadmin/me`,
            (() => {
              const fd = new FormData();
              Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
              fd.append("labPhoto", labPhotoFile);
              return fd;
            })(),
            { headers: baseHeaders }
          )
        : await axios.put(`${API_BASE}/api/labadmin/me`, payload, {
            headers: { ...baseHeaders, "Content-Type": "application/json" },
          });

      const updated = res.data?.labAdmin;
      if (updated) {
        localStorage.setItem("labAdmin", JSON.stringify(updated));
        const nextForm = {
          ownerName: updated.ownerName || updated.name || form.ownerName || "",
          email: updated.email || form.email || "",
          mobile: updated.mobile || "",
          labName: updated.labName || "",
          licenseNumber: updated.licenseNumber || "",
          experience:
            updated.experience === 0 || updated.experience
              ? String(updated.experience)
              : "",
          openingDay: updated.openingDay || "",
          openingTime: updated.openingTime || "",
          closingTime: updated.closingTime || "",
          address: updated.address || "",
          slogan: updated.slogan || "",
          about: updated.about || "",
          whyChooseUs: updated.whyChooseUs || "",
          happyPatients:
            updated.happyPatients === 0 || updated.happyPatients
              ? String(updated.happyPatients)
              : "",
        };
        setForm(nextForm);
        setInitialSnapshot(nextForm);
        setDocuments({
          licenseFile: normalizeAssetUrl(updated.licenseFile || documents.licenseFile || ""),
          labPhoto: normalizeAssetUrl(updated.labPhoto || documents.labPhoto || ""),
        });
        setLabPhotoFile(null);
        setSuccess("Profile updated successfully.");
        setIsEditing(false);
      } else {
        setSuccess("Profile saved.");
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const ic =
    "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent";
  const lc = "block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5";

  const displayName = (form.ownerName || form.email || "").toString().trim();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and edit your lab details.
          </p>
        </div>

        {(error || success) && (
          <div
            className={`mb-4 rounded-xl p-4 text-sm ${
              error
                ? "bg-red-50 border border-red-100 text-red-600"
                : "bg-emerald-50 border border-emerald-100 text-emerald-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          {loading ? (
            <div className="text-slate-500">Loading profile…</div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Logged in as</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{displayName}</p>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="profileForm"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold disabled:opacity-60"
                      >
                        {saving ? "Saving…" : "Save Changes"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <form id="profileForm" onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={lc}>Owner Name</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Email (read-only)</label>
                <input className={`${ic} bg-slate-50`} name="email" value={form.email} disabled />
              </div>

              <div>
                <label className={lc}>Mobile</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Lab Name</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="labName"
                  value={form.labName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>License Number</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Experience (years)</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="experience"
                  type="number"
                  min={0}
                  value={form.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Opening Day</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="openingDay"
                  value={form.openingDay}
                  onChange={handleChange}
                  placeholder="e.g. Mon-Sat"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Opening Time</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="openingTime"
                  value={form.openingTime}
                  onChange={handleChange}
                  placeholder="e.g. 09:00 AM"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Closing Time</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="closingTime"
                  value={form.closingTime}
                  onChange={handleChange}
                  placeholder="e.g. 07:00 PM"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Slogan</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="slogan"
                  value={form.slogan}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className={lc}>Happy Patients</label>
                <input
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="happyPatients"
                  type="number"
                  min={0}
                  value={form.happyPatients}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="md:col-span-2">
                <label className={lc}>About Us</label>
                <textarea
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  rows={3}
                  disabled={!isEditing}
                />
              </div>

              <div className="md:col-span-2">
                <label className={lc}>Why Choose Us</label>
                <textarea
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="whyChooseUs"
                  value={form.whyChooseUs}
                  onChange={handleChange}
                  rows={3}
                  disabled={!isEditing}
                />
              </div>

              <div className="md:col-span-2">
                <label className={lc}>Address</label>
                <textarea
                  className={`${ic} ${!isEditing ? "bg-slate-50" : ""}`}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="md:col-span-2">
                  <label className={lc}>Upload Your Lab Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLabPhotoFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-900 file:text-white file:font-semibold hover:file:bg-slate-800"
                  />
                  <p className="mt-1 text-xs text-slate-400">PNG/JPG recommended.</p>
                </div>
              )}

              {isEditing && (
                <div className="md:col-span-2 flex items-center justify-end">
                  <p className="text-xs text-slate-400">
                    Click “Save Changes” to update your profile.
                  </p>
                </div>
              )}
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Documents</h2>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">License Document</p>
                    {documents.licenseFile ? (
                      <a
                        href={documents.licenseFile}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center text-sm font-semibold text-slate-900 hover:underline"
                      >
                        View / Download
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Not uploaded</p>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Lab Photo</p>
                    {documents.labPhoto ? (
                      <img
                        src={documents.labPhoto}
                        alt="Lab"
                        className="mt-3 w-full h-40 object-cover rounded-xl border border-slate-200"
                      />
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
