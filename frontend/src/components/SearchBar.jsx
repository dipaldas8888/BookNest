import React, { useState } from "react";

const SearchBar = ({ setSearch }) => {
  const [text, setText] = useState("");

  const handleSearch = () => {
    setSearch(text);
  };

  return (
    <div className="flex justify-center gap-3 mb-8">
      <input
        type="text"
        placeholder="Search books..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border rounded-lg px-4 py-2 w-96"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
