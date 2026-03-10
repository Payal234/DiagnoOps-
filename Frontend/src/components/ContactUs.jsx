import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const ContactUs = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit number";
    }

    if (!formData.enquiry.trim()) {
      newErrors.enquiry = "Please write your enquiry";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      alert("Enquiry Sent Successfully");
      setFormData({
        name: "",
        email: "",
        phone: "",
        enquiry: ""
      });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="w-full bg-gray-50 py-10 px-4 sm:px-6">

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

        {/* CONTACT FORM */}
        <div className="p-6 sm:p-8">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <textarea
                name="enquiry"
                placeholder="Your Enquiry"
                rows="4"
                value={formData.enquiry}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.enquiry && (
                <p className="text-red-500 text-sm mt-1">{errors.enquiry}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Send Message
            </button>

          </form>

        </div>

        {/* LAB CONTACT INFO */}
        <div className="bg-gray-100 p-6 sm:p-8 ">

          {/* <h2 className="text-2xl font-bold mb-6 text-center">
            Lab Contact Info
          </h2> */}

          {/* 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700 text-center">

            <div className="flex flex-col items-center gap-2">
              <MapPin className="text-green-600" size={24} />
              <p className="text-sm">
                123 Health Street, Medical Square,
                Nagpur, Maharashtra 440010
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Phone className="text-green-600" size={24} />
              <p className="text-sm">+91 9876543210</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Mail className="text-green-600" size={24} />
              <p className="text-sm">support@diagnoops.com</p>
            </div>

          </div>

          {/* Social Icons — centered below 3 columns */}
          <div className="flex gap-4 pt-6 justify-center">

            <div className="bg-white p-3 rounded-full shadow hover:scale-110 transition cursor-pointer">
              <FaFacebookF />
            </div>

            <div className="bg-white p-3 rounded-full shadow hover:scale-110 transition cursor-pointer">
              <FaInstagram />
            </div>

            <div className="bg-white p-3 rounded-full shadow hover:scale-110 transition cursor-pointer">
              <FaTwitter />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactUs;