import React from "react";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Rahul Sharma",
    rating: 5,
    image: "/images/Lab1.png",
    text: "Diagnoops made booking lab tests extremely easy. Reports were delivered on time and the process was smooth.",
  },
  {
    name: "Priya Verma",
    rating: 4,
    image: "/images/Lab1.png",
    text: "Very convenient platform for booking health tests. The UI is simple and user friendly.",
  },
  {
    name: "Amit Patel",
    rating: 5,
    image: "/images/Lab1.png",
    text: "Excellent service! I could compare labs and book instantly without any hassle.",
  },
  {
    name: "Sneha Kulkarni",
    rating: 4,
    image: "/images/Lab1.png",
    text: "Fast booking and reliable lab partners. Highly recommended for medical tests.",
  },
  {
    name: "Vikas Gupta",
    rating: 5,
    image: "/images/Lab1.png",
    text: "Diagnoops saved my time. I booked a test from home and got quick confirmation.",
  },
];

const Testimonial = () => {
  return (
    <section className="bg-gray-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <h2 className="text-3xl font-bold text-center mb-10">
          What Our Users Say
        </h2>

        <div className="relative w-full overflow-hidden">

          <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="bg-white shadow-lg rounded-xl p-6 w-72 md:w-80 flex-shrink-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                "{item.text}"
              </p>
            </div>
          ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonial;