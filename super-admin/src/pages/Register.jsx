import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        const response = await fetch(
          "https://diagnoops-backend.vercel.app/api/superadmin/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("superAdmin", JSON.stringify(data.superAdmin));

          setSuccessMessage("Registration successful! Redirecting...");

          setFormData({
            fullName: "",
            email: "",
            password: "",
          });

          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 2000);
        } else {
          setApiError(data.message || "Registration failed");
        }
      } catch (error) {
        setApiError("Network error. Try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16  bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8 8 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join your platform
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100">

          {/* Success */}
          {successMessage && (
            <p className="text-green-600 text-sm mb-3">{successMessage}</p>
          )}

          {/* Error */}
          {apiError && (
            <p className="text-red-500 text-sm mb-3">{apiError}</p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full mt-1 px-4 py-3 sm:py-3.5 border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-800`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className={`w-full mt-1 px-4 py-3 sm:py-3.5 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-800`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 sm:py-3.5 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-800`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  👁
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-medium border border-transparent rounded-lg cursor-pointer text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          © 2026 Your Company
        </p>
      </div>
    </div>
  );
};

export default Register;