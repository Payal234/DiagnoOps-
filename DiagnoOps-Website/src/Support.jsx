import React, { useState } from "react";

const Support = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "How do I book a lab test?",
      a: "You can book a test from your dashboard by selecting a lab and preferred time slot.",
    },
    {
      q: "How can labs manage reports?",
      a: "Labs can upload and manage reports directly from their dashboard.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, we use secure encryption to protect your data.",
    },
    {
      q: "How to contact support?",
      a: "You can contact us via email or through the support section.",
    },
  ];

  return (
    <div className="bg-white text-gray-800 min-h-screen">

      {/* HEADER */}
      <section className="text-center py-16 px-6 bg-gradient-to-b from-cyan-50 to-white">
        <h1 className="text-4xl font-bold mb-4">Support Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get help with DiagnoOps. Browse guides, documentation, FAQs, or contact support.
        </p>
      </section>

      {/* SUPPORT OPTIONS */}
      <section className="grid md:grid-cols-4 gap-6 px-6 md:px-16 py-12">

        {[
          {
            title: "Help Center",
            desc: "Find solutions and guides for common issues.",
            icon: "📚",
          },
          {
            title: "Documentation",
            desc: "Explore detailed technical and user documentation.",
            icon: "📄",
          },
          {
            title: "Report Issue",
            desc: "Facing a problem? Reach out to our support team.",
            icon: "⚠️",
          },
          {
            title: "FAQs",
            desc: "Quick answers to common questions.",
            icon: "❓",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 text-center"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-lg text-cyan-600 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* REPORT ISSUE INFO */}
      <section className="px-6 md:px-16 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          Report an Issue
        </h2>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-4">

          <p className="text-gray-600">
            If you are experiencing any issues with the platform, please contact our support team.
          </p>

          <div className="bg-cyan-50 p-4 rounded-lg">
            <p className="font-semibold text-cyan-600">📧 Email Support</p>
            <p className="text-gray-700">support@diagnoops.com</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Steps to Report an Issue:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Describe the issue clearly</li>
              <li>Attach screenshots if possible</li>
              <li>Mention your account details</li>
              <li>Send it to our support email</li>
            </ul>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md cursor-pointer"
              onClick={() =>
                setOpenFAQ(openFAQ === index ? null : index)
              }
            >
              <h3 className="font-semibold flex justify-between">
                {item.q}
                <span>{openFAQ === index ? "−" : "+"}</span>
              </h3>

              {openFAQ === index && (
                <p className="text-gray-600 mt-2">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cyan-50 text-center py-12 px-6">
        <h2 className="text-xl font-semibold mb-3">
          Need more help?
        </h2>
        <p className="text-gray-600 mb-4">
          Our team is always ready to assist you.
        </p>
        <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition">
          Contact Support
        </button>
      </section>

    </div>
  );
};

export default Support;