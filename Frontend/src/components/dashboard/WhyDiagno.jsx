import { ShieldCheck, Clock, Search } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
    title: "Trusted Labs",
    desc: "We partner with reliable and verified diagnostic labs to ensure accurate testing and trusted medical services.",
  },
  {
    icon: <Search className="w-8 h-8 text-teal-600" />,
    title: "Easy Access",
    desc: "Quickly search labs, explore available tests and check timings with a simple and user-friendly interface.",
  },
  {
    icon: <Clock className="w-8 h-8 text-teal-600" />,
    title: "Convenient Experience",
    desc: "Manage everything in one place — explore labs, view tests and track your bookings easily.",
  },
];

const WhyDiagno = () => {
  return (
    <section className="py-12 md:py-16 bg-white cursor-pointer">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
          Why Choose <span className="text-teal-600 break-words">DiagnoOps</span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-center"
            >
              <div className="flex justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="font-semibold text-lg md:text-xl mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm md:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyDiagno;