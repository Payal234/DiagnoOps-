import { Link } from "react-router-dom";
// video used instead of animation

const HeroDiagno = () => {
  return (
    <section className=" py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div className="text-center md:text-left">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
            Find Diagnostic Labs &  
            <span className="text-teal-600"> Medical Tests</span> Easily
          </h1>

          <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-xl mx-auto md:mx-0">
            Discover nearby diagnostic labs, explore available medical tests
            and manage your lab visits easily with DiagnoOps.
          </p>

          <Link
            to="/labs"
            className="inline-block bg-teal-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-teal-700 transition shadow-md"
          >
            Explore Labs
          </Link>

        </div>

        {/* Hero video */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <video
              src="/images/Hero_v.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroDiagno;