import { useState, useContext } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { CartContext } from "../context/CartContext";

const Tests = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { addToCart } = useContext(CartContext);

  const testsData = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      price: 350,
      category: "Blood",
      type: "test",
      time: "6 hours",
      description: "Measures red & white blood cells, hemoglobin, platelets.",
    },
    {
      id: 2,
      name: "Lipid Profile",
      price: 600,
      category: "Blood",
      type: "test",
      time: "12 hours",
      description: "Checks cholesterol levels including HDL, LDL.",
    },
    {
      id: 3,
      name: "Urine Routine & Microscopy",
      price: 200,
      category: "Urine",
      type: "test",
      time: "4 hours",
      description: "Basic urine analysis for infections.",
    },
    {
      id: 4,
      name: "Thyroid Panel",
      price: 800,
      category: "Blood",
      type: "test",
      time: "24 hours",
      description: "Comprehensive thyroid function assessment.",
    },
    {
      id: 5,
      name: "Full Body Checkup",
      price: 2499,
      category: "Packages",
      type: "package",
      time: "48 hours",
      description: "Complete health check package.",
    },
  ];

  const filteredTests = testsData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 cursor-pointer">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">
          Tests & Packages
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Browse and book diagnostic tests
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}
        <div className="relative w-full lg:w-1/2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm md:text-base border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide cursor-pointer">
          {["All", "Blood", "Urine", "Imaging", "Packages"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 md:px-4 py-1.5 md:py-2 whitespace-nowrap rounded-full text-xs md:text-sm ${
                category === cat
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">

        {filteredTests.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 md:p-5 rounded-lg md:rounded-xl shadow hover:shadow-lg transition"
          >
            {/* Top */}
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-base md:text-lg leading-snug">
                {item.name}
              </h3>
              <span className="text-teal-600 font-bold text-sm md:text-base whitespace-nowrap">
                ₹{item.price}
              </span>
            </div>

            <p className="text-gray-500 text-xs md:text-sm mt-2">
              {item.description}
            </p>

            <div className="flex justify-between text-xs md:text-sm text-gray-400 mt-3">
              <span>{item.category}</span>
              <span>{item.time}</span>
            </div>

            {/* Button */}
            <button
              onClick={() => addToCart(item)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 text-sm md:text-base rounded-lg"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        ))}
          </div>

      {filteredTests.length === 0 && (
        <div className="text-center text-gray-500 text-sm">
          No tests found.
        </div>
      )}
    </div>
  );
};

export default Tests;