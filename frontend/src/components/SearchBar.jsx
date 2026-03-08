import React from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex items-center justify-center  flex-1 py-3">
      <div className="relative flex gap-2">
        <Search className="text-blue-600 absolute top-1 mx-2" />
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-lg w-2xl h-8 px-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="bg-blue-500 flex items-center rounded-lg w-[90px]">
          <Search />
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
