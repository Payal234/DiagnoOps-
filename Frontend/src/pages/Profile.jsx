import React, { useState } from "react";
import { User, Phone, MapPin, Heart } from "lucide-react";

export default function Profile() {
  // 👇 Assume this data comes after login
  const loggedInUser = {
    fullName: "John Patient",
    email: "payaldhobale@gmail.com",
    age: "32",
    gender: "Male",
    phone: "+91 98765 43210",
    address: "123, Health Street, Mumbai",
    bloodGroup: "B+",
    allergies: "None",
  };

  const [formData, setFormData] = useState(loggedInUser);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Data:", formData);
    alert("Profile Saved Successfully ✅");
  };

  return (
    <div className="min-h-screen  sm:px-6 lg:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500  mb-6">
          Manage your personal and medical information
        </p>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-2">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white text-2xl font-semibold">
              {formData.fullName.charAt(0)}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold text-gray-800">
                {formData.fullName}
              </h2>
              <p className="text-gray-500 text-sm break-all">
                {formData.email}
              </p>
            </div>
          </div>

          <hr className="my-6" />

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-800">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                <Input label="Age" name="age" value={formData.age} onChange={handleChange} />
                <Input label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="mt-4">
                <Input label="Address" name="address" value={formData.address} onChange={handleChange} full />
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
                <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
                <Input label="Known Allergies" name="allergies" value={formData.allergies} onChange={handleChange} />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Component */
function Input({ label, name, value, onChange, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}