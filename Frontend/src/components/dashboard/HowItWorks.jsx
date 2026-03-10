import { Search, FlaskConical, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Nearby Labs",
    desc: "Easily search diagnostic labs near your location. View lab name, opening hours, location and other important details to choose the right lab.",
  },
  {
    icon: FlaskConical,
    title: "Explore Available Tests",
    desc: "Browse all medical tests offered by a lab before visiting. Understand the available services and choose the test you need.",
  },
  {
    icon: CalendarCheck,
    title: "Visit or Manage Bookings",
    desc: "Visit the lab directly or manage your bookings through the platform while keeping track of your appointments.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-14 md:py-20 bg-blue-50 cursor-pointer">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold">
            How <span className="text-teal-600">DiagnoOps</span> Works
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mt-3 text-sm md:text-base">
            DiagnoOps helps you quickly find diagnostic labs, explore available
            tests and manage your healthcare services with a simple and
            user-friendly platform.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="relative bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >

                {/* Step Badge */}
                <span className="absolute -top-3 left-6 bg-teal-600 text-white text-xs px-3 py-1 rounded-full">
                  Step {index + 1}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-5">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {step.desc}
                </p>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;