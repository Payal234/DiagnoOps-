import React from "react";

const Platform = () => {
  return (
    <div className="bg-white text-gray-800">

      {/* HERO */}
      <section className="text-center py-20 px-6 bg-gradient-to-b from-cyan-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          DiagnoOps Platform
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          A smart diagnostics platform for Patients, Labs, and Admins with
          seamless workflows and real-time insights.
        </p>

        <button className="mt-6 bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition">
          Get Started
        </button>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-16 py-16">

        {/* CARD COMPONENT */}
        {[
          {
            title: "For Patients",
            desc: "Book tests, view reports instantly, and track health records anytime.",
            img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
          },
          {
            title: "For Labs",
            desc: "Manage bookings, automate workflows, and generate reports efficiently.",
            img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
          },
          {
            title: "For Admins",
            desc: "Monitor users, track analytics, and manage the entire platform.",
            img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >
            <div className="relative">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-52 object-cover"
              />
              {/* overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-cyan-600 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gray-50 py-16 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose DiagnoOps?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "⚡ Fast & Efficient",
              desc: "Automate workflows and reduce manual effort.",
            },
            {
              title: "🔒 Secure Platform",
              desc: "Your data is protected with advanced security.",
            },
            {
              title: "📊 Smart Insights",
              desc: "Real-time analytics for better decisions.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition"
            >
              <h3 className="text-lg font-semibold text-cyan-600 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Register",
              desc: "Sign up easily as a patient, lab, or admin.",
              icon: "📝",
            },
            {
              title: "Manage",
              desc: "Handle bookings and reports smoothly.",
              icon: "⚙️",
            },
            {
              title: "Analyze",
              desc: "Get insights and improve performance.",
              icon: "📈",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="hover:scale-105 transition duration-300"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cyan-50 text-center py-16 px-6">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to transform your lab operations?
        </h2>
        <p className="text-gray-600 mb-6">
          Join DiagnoOps and simplify diagnostics today.
        </p>
        <button className="bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition">
          Join Now
        </button>
      </section>
    </div>
  );
};

export default Platform;