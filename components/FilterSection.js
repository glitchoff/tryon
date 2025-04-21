// components/FilterSection.jsx
import { Filter, X } from "lucide-react";

export default function FilterSection({
  genderFilter,
  setGenderFilter,
  categoryFilter,
  setCategoryFilter,
  isFilterOpen,
  setIsFilterOpen,
  categories,
}) {
  return (
    <>
      {/* Mobile Filter Button */}
      <button
        className="md:hidden flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        {isFilterOpen ? <X className="w-4 h-4 mr-2" /> : <Filter className="w-4 h-4 mr-2" />}
        {isFilterOpen ? "Close" : "Filters"}
      </button>

      {/* Filters - Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isFilterOpen ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
            <div className="flex flex-wrap gap-2">
              {["All", "Male", "Female"].map((gender) => (
                <button
                  key={gender}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    genderFilter === gender ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setGenderFilter(gender)}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    categoryFilter === category ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Desktop */}
      <div className="hidden md:flex md:flex-wrap md:items-center gap-3 mb-8">
        <div className="flex gap-2">
          {["All", "Male", "Female"].map((gender) => (
            <button
              key={gender}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                genderFilter === gender
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setGenderFilter(gender)}
            >
              {gender}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === category
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}