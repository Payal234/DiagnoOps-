import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Heart } from "lucide-react";

export default function Profile() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://diagnoops-backend.vercel.app";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    allergies: "",
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryUserId = params.get("userId");
    const storedUserId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");

    let userId = queryUserId || storedUserId;
    if (!userId && storedUser) {
      try {
        userId = JSON.parse(storedUser)?._id;
      } catch {
        userId = "";
      }
    }

    if (!userId) {
      setMessage("Please login first to view profile.");
      setLoading(false);
      return;
    }

    axios
      .get(`${backendUrl}/api/auth/profile/${userId}`)
      .then((res) => {
        const user = res.data;
        setFormData({
          _id: user._id,
          name: user.name || "",
          email: user.email || "",
          age: user.age || "",
          gender: user.gender || "",
          phone: user.phone || "",
          address: user.address || "",
          bloodGroup: user.bloodGroup || "",
          allergies: user.allergies || "",
        });
        setOriginalData({
          _id: user._id,
          name: user.name || "",
          email: user.email || "",
          age: user.age || "",
          gender: user.gender || "",
          phone: user.phone || "",
          address: user.address || "",
          bloodGroup: user.bloodGroup || "",
          allergies: user.allergies || "",
        });
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);
      })
      .catch(() => {
        setMessage("Unable to load profile.");
      })
      .finally(() => setLoading(false));
  }, [backendUrl]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData._id) return;

    setSaving(true);
    setMessage("");

    axios
      .put(`${backendUrl}/api/auth/profile/${formData._id}`, {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
      })
      .then((res) => {
        const updated = res.data.user;
        setFormData({
          _id: updated._id,
          name: updated.name || "",
          email: updated.email || "",
          age: updated.age || "",
          gender: updated.gender || "",
          phone: updated.phone || "",
          address: updated.address || "",
          bloodGroup: updated.bloodGroup || "",
          allergies: updated.allergies || "",
        });
        setOriginalData({
          _id: updated._id,
          name: updated.name || "",
          email: updated.email || "",
          age: updated.age || "",
          gender: updated.gender || "",
          phone: updated.phone || "",
          address: updated.address || "",
          bloodGroup: updated.bloodGroup || "",
          allergies: updated.allergies || "",
        });
        localStorage.setItem("user", JSON.stringify(updated));
        localStorage.setItem("userId", updated._id);
        setMessage("Profile saved successfully.");
        setIsEditing(false);
      })
      .catch(() => {
        setMessage("Profile save failed.");
      })
      .finally(() => setSaving(false));
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setMessage("");
  };

  const handleStartEdit = () => {
    setMessage("");
    setIsEditing(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen  sm:px-6 lg:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              My Profile
            </h1>
            <p className="text-gray-500">
              Manage your personal and medical information
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                form="profile-form"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-2">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white text-2xl font-semibold">
              {(formData.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold text-gray-800">
                {formData.name || "User"}
              </h2>
              <p className="text-gray-500 text-sm break-all">
                {formData.email}
              </p>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-sm font-medium text-teal-700">{message}</p>
          )}

          <hr className="my-6" />

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-800">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                <Input label="Email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                <Input label="Age" name="age" value={formData.age} onChange={handleChange} disabled={!isEditing} />
                <Input label="Gender" name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing} />
                <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
              </div>

              <div className="mt-4">
                <Input label="Address" name="address" value={formData.address} onChange={handleChange} full disabled={!isEditing} />
              </div>
            </div>

            {/* Medical Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="font-medium text-gray-800">
                  Medical Info (Optional)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditing} />
                <Input label="Known Allergies" name="allergies" value={formData.allergies} onChange={handleChange} disabled={!isEditing} />
              </div>
            </div>

            {!isEditing && (
              <p className="text-sm text-gray-500">
                Click Edit Profile to update details, then Save Changes.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Component */
function Input({ label, name, value, onChange, full, disabled = false }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${disabled ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"}`}
      />
    </div>
  );
}