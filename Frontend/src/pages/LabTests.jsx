import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, ArrowLeft } from "lucide-react";
import { CartContext } from "../context/CartContext";

const LabTests = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { addToCart } = useContext(CartContext);

  const allTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      price: 350,
      category: "Blood",
      type: "test",
      time: "6 hours",
      description: "Measures red & white blood cells, hemoglobin, platelets.",
      lab: "1",
    },
    {
      id: 2,
      name: "Lipid Profile",
      price: 600,
      category: "Blood",
      type: "test",
      time: "12 hours",
      description: "Checks cholesterol levels including HDL, LDL.",
      lab: "1",
    },
    {
      id: 3,
      name: "Urine Routine & Microscopy",
      price: 200,
      category: "Urine",
      type: "test",
      time: "4 hours",
      description: "Basic urine analysis for infections.",
      lab: "2",
    },
    {
      id: 4,
      name: "Thyroid Panel",
      price: 800,
      category: "Blood",
      type: "test",
      time: "24 hours",
      description: "Comprehensive thyroid function assessment.",
      lab: "3",
    },
    {
      id: 5,
      name: "Full Body Checkup",
      price: 2499,
      category: "Packages",
      type: "package",
      time: "48 hours",
      description: "Complete health check package.",
      lab: "2",
    },
  ];

  const testsData = labId
    ? allTests.filter((t) => t.lab === labId)
    : allTests;

  const filteredTests = testsData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen space-y-6">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white shadow"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {labId ? `Lab ${labId} Tests` : "Tests & Packages"}
        </h1>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">

        {/* Search */}
        <div className="relative w-full lg:w-1/2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {"All,Blood,Urine,Imaging,Packages".split(",").map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                category === cat
                  ? "bg-teal-600 text-white shadow"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredTests.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl shadow-sm  hover:shadow-lg transition duration-300 flex flex-col justify-between"
          >

            {/* Top */}
            <div>

              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.name}
                </h3>

                <span className="text-teal-600 font-bold text-lg">
                  ₹{item.price}
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-2">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
                  {item.category}
                </span>

                <span className="text-gray-400">
                  Result: {item.time}
                </span>
              </div>
           </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => addToCart(item)}
                className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm cursor-pointer"
              >
              <ShoppingCart size={16} />
              Add
              </button>

              <button
                onClick={() => navigate(`/test-details/${item.id}`)}
                className="flex-1 border border-teal-600 text-teal-600 hover:bg-teal-50 py-2 rounded-lg text-sm cursor-pointer"
              >
                Details
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* Empty State */}
      {filteredTests.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No tests found for this lab.
        </div>
      )}
    </div>
  );
};

export default LabTests;