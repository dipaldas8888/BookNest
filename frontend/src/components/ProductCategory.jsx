import React from "react";
import { categories } from "../data/categories";

const ProductCategory = ({ setSelectedCategory, selectedCategory }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      {/* ALL CATEGORY */}
      <button
        onClick={() => setSelectedCategory("All")}
        className={`flex items-center gap-2 rounded-lg p-3 
        ${selectedCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-400"}`}
      >
        All
      </button>

      {categories.map((cat) => {
        const Icon = cat.icon;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 rounded-lg p-3
            ${
              selectedCategory === cat.name
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProductCategory;
