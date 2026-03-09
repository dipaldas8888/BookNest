import React from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex justify-center py-4 px-4">
      <div className="relative flex items-center gap-2 w-full max-w-xl">
        <Search className="absolute left-3 text-blue-600 w-4 h-4" />

        <input
          type="text"
          placeholder="Search"
          className="w-full border border-gray-300 rounded-lg h-10 pl-9 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button className="bg-blue-500 text-white flex items-center gap-2 px-4 h-10 rounded-lg hover:bg-blue-600 transition">
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
