const AboutDiagno = () => {
  return (
    <section className="py-12 md:py-16 bg-blue-50 cursor-pointer">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
          About <span className="text-teal-600 break-words">DiagnoOps</span>
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
          DiagnoOps is a platform that helps users easily find diagnostic labs,
          explore medical tests and manage their bookings in one place.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-gray-700">

          <ul className="space-y-3 md:space-y-4 text-sm md:text-lg">
            <li>✔ Find nearby diagnostic labs with location and timings</li>
            <li>✔ Explore all tests available in each lab</li>
            <li>✔ View detailed information about labs</li>
          </ul>

          <ul className="space-y-3 md:space-y-4 text-sm md:text-lg">
            <li>✔ Manage your test bookings in My Bookings</li>
            <li>✔ Easily navigate between labs and tests</li>
            <li>✔ Simple and user-friendly healthcare platform</li>
          </ul>

        </div>

      </div>
    </section>
  );
};

export default AboutDiagno;