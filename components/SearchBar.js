// components/SearchBar.jsx
import { Search, X } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, isSearchFocused, setIsSearchFocused }) {
  return (
    <div className={`relative transition-all duration-300 ${isSearchFocused ? "w-full md:w-72" : "w-full md:w-64"}`}>
      <input
        type="text"
        placeholder="Search styles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}