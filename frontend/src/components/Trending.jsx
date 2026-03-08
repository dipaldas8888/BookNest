import React from "react";
import { ShoppingCart } from "lucide-react";
const trendingBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    description: "Guide to good habits and breaking bad ones.",
    price: 18.99,
    image: "https://covers.openlibrary.org/b/isbn/0735211299-M.jpg",
  },
  {
    id: 2,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness.",
    price: 15.99,
    image: "https://covers.openlibrary.org/b/isbn/0857197681-M.jpg",
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    description: "Rules for focused success in a distracted world.",
    price: 16.99,
    image: "https://covers.openlibrary.org/b/isbn/1455586692-M.jpg",
  },
];

const Trending = () => {
  return (
    <section className="max-w-7xl mx-auto p-2">
      <h1 className="text-center font-semibold text-3xl py-6">Trending</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 rounded-sm bg-gray-100">
        {trendingBooks.map((book) => (
          <div
            key={book.id}
            className=" flex gap-3 bg-white rounded-xl shadow-md hover:shadow-xl transition"
          >
            <img
              src={book.image}
              className=" w-[180px] h-[250px] rounded object-cover"
            />
            <div className="flex flex-col gap-2 py-6 px-3">
              <h1 className=" font-bold">{book.title}</h1>
              <h1 className="text-shadow-blue-950 text-gray-600 overflow-hidden">
                {book.description}
              </h1>
              <span className="font-bold text-black">{book.price}</span>
              <button className="flex items-center gap-2 py-4 bg-emerald-400 rounded-xl justify-center hover:bg-emerald-600">
                <ShoppingCart size={26} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trending;
