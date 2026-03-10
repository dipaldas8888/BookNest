import React from "react";
import { categories } from "../data/categories";

const ProductCategory = ({ setSelectedCategory }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      {categories.map((cat) => {
        const Icon = cat.icon;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className="flex items-center gap-2 bg-gray-200 rounded-lg p-3 hover:bg-gray-400"
          >
            <Icon className="text-blue-500 w-5 h-5" />
            <span className="text-sm  text-shadow-lg">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProductCategory;
