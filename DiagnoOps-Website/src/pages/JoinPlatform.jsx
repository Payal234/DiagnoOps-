import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STEPS = ["Owner Info", "Lab Details", "Documents"];

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-1">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{children}</h3>
  </div>
);

const NextBtn = ({ onClick }) => (
  <button type="button" onClick={onClick}
    className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 group shadow-sm">
    Continue
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
  </button>
);

const BackBtn = ({ onClick }) => (
  <button type="button" onClick={onClick}
    className="px-6 py-3 border border-slate-200 text-slate-500 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
    Back
  </button>
);

const JoinPlatform = () => {
  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(0);
  const [licenseFile, setLicenseFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    ownerName: "", mobile: "", email: "", password: "",
    labName: "", licenseNumber: "", experience: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (errorMsg) setErrorMsg("");
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(String(email).trim());

  const normalizeMobile = (mobile) => String(mobile || "").replace(/\s+/g, "").replace(/[^0-9]/g, "");

  const validateStep = (stepIndex) => {
    const nextErrors = {};

    if (stepIndex === 0) {
      if (!form.ownerName.trim()) nextErrors.ownerName = "Owner name is required.";

      const digits = normalizeMobile(form.mobile);
      if (!digits) nextErrors.mobile = "Mobile number is required.";
      else if (digits.length < 10 || digits.length > 15) nextErrors.mobile = "Mobile number must be 10–15 digits.";

      if (!form.email.trim()) nextErrors.email = "Email is required.";
      else if (!isValidEmail(form.email)) nextErrors.email = "Email is invalid.";

      if (!form.password) nextErrors.password = "Password is required.";
      else {
        const password = String(form.password);
        const hasLetter = /[A-Za-z]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
        else if (!hasLetter || !hasSymbol) nextErrors.password = "Password must include at least 1 letter and 1 symbol.";
      }
    }

    if (stepIndex === 1) {
      if (!form.labName.trim()) nextErrors.labName = "Lab name is required.";
      if (!form.licenseNumber.trim()) {
        nextErrors.licenseNumber = "License number is required.";
      } else {
        const ln = String(form.licenseNumber).trim();
        const allowed = /^[A-Za-z0-9\-/]+$/;
        const hasLetter = /[A-Za-z]/.test(ln);
        const hasDigit = /\d/.test(ln);

        if (ln.length < 5 || ln.length > 30) nextErrors.licenseNumber = "License number must be 5–30 characters.";
        else if (!allowed.test(ln)) nextErrors.licenseNumber = "Use only letters, numbers, '-' or '/' (no spaces).";
        else if (!hasLetter || !hasDigit) nextErrors.licenseNumber = "License number must include at least 1 letter and 1 number.";
      }

      if (form.experience !== "") {
        const exp = Number(form.experience);
        if (Number.isNaN(exp) || exp < 0) nextErrors.experience = "Experience must be 0 or greater.";
      }
    }

    if (stepIndex === 2) {
      if (!licenseFile) nextErrors.licenseFile = "License document is required.";
      if (licenseFile) {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(licenseFile.type)) nextErrors.licenseFile = "Only PDF, JPG, or PNG files are allowed.";
        const maxBytes = 10 * 1024 * 1024;
        if (licenseFile.size > maxBytes) nextErrors.licenseFile = "File size must be 10 MB or less.";
      }

      if (!agreeTerms) nextErrors.agreeTerms = "Please accept the Terms & Conditions.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    const ok = validateStep(2);
    if (!ok) {
      setErrorMsg("Please fix the highlighted fields.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (licenseFile) formData.append("licenseFile", licenseFile);
      const res = await axios.post("https://diagnoops-backend.vercel.app/api/labadmin/register", formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setForm({ ownerName: "", mobile: "", email: "", password: "", labName: "", licenseNumber: "", experience: "", address: "" });
        setLicenseFile(null); setAgreeTerms(false); setStep(0);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const ic = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200 hover:border-slate-300";
  const lc = "block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.3 }} />
      <div className="fixed inset-0 pointer-events-none bg-linear-to-br from-white/70 via-transparent to-slate-100/60" />

      <div className="relative w-full max-w-2xl">

        {/* ── Header Card ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 mb-2 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-slate-200 via-slate-600 to-slate-200 rounded-t-2xl" />

          <button onClick={() => navigate(-1)}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Healthcare Network</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">Register Your Lab</h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed pl-16">
            Join our trusted network and start receiving patient bookings seamlessly.
          </p>
        </div>

        {/* ── Step Indicator ── */}
        {!successMsg && (
          <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 mb-2 shadow-sm">
            <div className="flex items-center">
              {STEPS.map((label, i) => (
                <React.Fragment key={i}>
                  <button type="button" onClick={() => i < step && setStep(i)}
                    className="flex items-center gap-2.5 shrink-0 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                      ${i < step ? "bg-slate-800 border-slate-800 text-white"
                        : i === step ? "bg-white border-slate-800 text-slate-800"
                        : "bg-white border-slate-200 text-slate-300"}`}>
                      {i < step
                        ? <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        : i + 1}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block transition-colors
                      ${i === step ? "text-slate-800" : i < step ? "text-slate-500" : "text-slate-300"}`}>
                      {label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-all duration-500 ${i < step ? "bg-slate-400" : "bg-slate-100"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Form Card ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Success */}
          {successMsg && (
            <div className="p-10 sm:p-14 text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">You're all set!</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">{successMsg}</p>
              <button onClick={() => navigate(-1)}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all text-sm shadow-md">
                Back to Home
              </button>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">

              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {errorMsg}
                </div>
              )}

              {/* ── STEP 0 ── */}
              {step === 0 && (
                <div className="space-y-5 animate-fadein">
                  <SectionTitle>Owner Information</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={lc}>Owner Name <span className="text-red-400">*</span></label>
                      <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} required placeholder="Dr. Rajesh Kumar" className={ic} />
                      {fieldErrors.ownerName && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.ownerName}</p>
                      )}
                    </div>
                    <div>
                      <label className={lc}>Mobile Number <span className="text-red-400">*</span></label>
                      <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required placeholder="+91 98765 43210" className={ic} />
                      {fieldErrors.mobile && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.mobile}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={lc}>Email Address <span className="text-red-400">*</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="lab@example.com" className={ic} />
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className={lc}>Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          placeholder="Min. 8 characters"
                          className={ic + " pr-11"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-2">
                    <NextBtn onClick={() => {
                      const ok = validateStep(0);
                      if (!ok) {
                        setErrorMsg("Please fix the highlighted fields.");
                        return;
                      }
                      setErrorMsg("");
                      setStep(1);
                    }} />
                  </div>
                </div>
              )}

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <div className="space-y-5 animate-fadein">
                  <SectionTitle>Lab Details</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={lc}>Lab Name <span className="text-red-400">*</span></label>
                      <input type="text" name="labName" value={form.labName} onChange={handleChange} required placeholder="City Diagnostics Lab" className={ic} />
                      {fieldErrors.labName && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.labName}</p>
                      )}
                    </div>
                    <div>
                      <label className={lc}>License Number <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        required
                        placeholder="MH-LAB-2024-XXXXX"
                        className={ic}
                        inputMode="text"
                        autoComplete="off"
                      />
                      {fieldErrors.licenseNumber && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.licenseNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className={lc}>Experience (Years)</label>
                      <input type="number" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5" min="0" className={ic} />
                      {fieldErrors.experience && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.experience}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={lc}>Lab Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} rows="3" placeholder="Full address including city, state & pincode" className={ic + " resize-none"} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <BackBtn onClick={() => { setErrorMsg(""); setStep(0); }} />
                    <NextBtn onClick={() => {
                      const ok = validateStep(1);
                      if (!ok) {
                        setErrorMsg("Please fix the highlighted fields.");
                        return;
                      }
                      setErrorMsg("");
                      setStep(2);
                    }} />
                  </div>
                </div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <div className="space-y-6 animate-fadein">
                  <SectionTitle>License Verification</SectionTitle>

                  {/* Upload */}
                  <div>
                    <label className={lc}>Upload License Document</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all group">
                      <div className="flex flex-col items-center gap-1.5 px-4 text-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-slate-300 group-hover:text-slate-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        {licenseFile
                          ? <span className="text-sm font-semibold text-slate-700">{licenseFile.name}</span>
                          : <>
                            <span className="text-sm font-semibold text-slate-500">Click to upload or drag & drop</span>
                            <span className="text-xs text-slate-400">PDF, JPG, PNG — up to 10 MB</span>
                          </>}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setLicenseFile(file);
                          if (fieldErrors.licenseFile) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.licenseFile;
                              return next;
                            });
                          }
                          if (errorMsg) setErrorMsg("");
                        }}
                        className="hidden"
                      />
                    </label>
                    {fieldErrors.licenseFile && (
                      <p className="mt-2 text-xs text-red-500">{fieldErrors.licenseFile}</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Review Summary</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {[
                        ["Owner", form.ownerName], ["Mobile", form.mobile],
                        ["Email", form.email], ["Lab", form.labName],
                        ["License", form.licenseNumber], ["Experience", form.experience ? `${form.experience} yrs` : "—"],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="text-xs text-slate-400 mb-0.5">{k}</p>
                          <p className="text-sm font-semibold text-slate-700 truncate">{v || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ✅ Terms checkbox — native input with htmlFor for full clickability */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 cursor-pointer shrink-0 accent-slate-800"
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none">
                      I agree to the{" "}
                      <span className="text-slate-900 font-semibold underline underline-offset-2 decoration-slate-300 hover:decoration-slate-600 cursor-pointer transition-all">
                        Terms & Conditions
                      </span>
                      {" "}and{" "}
                      <span className="text-slate-900 font-semibold underline underline-offset-2 decoration-slate-300 hover:decoration-slate-600 cursor-pointer transition-all">
                        Privacy Policy
                      </span>
                    </label>
                  </div>
                  {fieldErrors.agreeTerms && (
                    <p className="-mt-3 text-xs text-red-500">{fieldErrors.agreeTerms}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <BackBtn onClick={() => { setErrorMsg(""); setStep(1); }} />
                    <button type="submit" disabled={!agreeTerms || loading}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                        ${agreeTerms && !loading
                          ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}>
                      {loading ? (
                        <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>Submitting...</>
                      ) : (
                        <>Register Lab
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadein { animation: fadein 0.22s ease-out; }
      `}</style>
    </div>
  );
};

export default JoinPlatform;