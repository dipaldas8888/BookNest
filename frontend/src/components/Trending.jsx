import React, { useEffect, useState } from "react";
import { ShoppingCart, Star, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cartSlice";
import { fetchBooks } from "../api/booksApi";

const fallbackBooks = [
  { _id: "f1", title: "Atomic Habits", price: 18.99, category: "Self-Help", coverImage: { url: "https://covers.openlibrary.org/b/isbn/0735211299-M.jpg" }, trending: true },
  { _id: "f2", title: "The Psychology of Money", price: 15.99, category: "Business", coverImage: { url: "https://covers.openlibrary.org/b/isbn/0857197681-M.jpg" }, trending: true },
  { _id: "f3", title: "Deep Work", price: 16.99, category: "Technology", coverImage: { url: "https://covers.openlibrary.org/b/isbn/1455586692-M.jpg" }, trending: true },
  { _id: "f4", title: "Rich Dad Poor Dad", price: 14.99, category: "Business", coverImage: { url: "https://covers.openlibrary.org/b/isbn/1612680194-M.jpg" }, trending: true },
];

const StarRating = ({ rating = 4.3 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-[#e67e22] text-[#e67e22]" : "text-gray-200"}`} />
    ))}
    <span className="ml-1 text-[10px] text-gray-400 font-bold">({rating})</span>
  </div>
);

const Trending = () => {
  const dispatch = useDispatch();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks({ trending: true, limit: 4 })
      .then((r) => setBooks(r.books?.length ? r.books : fallbackBooks))
      .catch(() => setBooks(fallbackBooks))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3a2a]" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#f9f7f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-tag mb-1.5">#1 BOOK OF THE MONTH YOU CAN'T MISS</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              Bestsellers This Week
            </h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#1a3a2a] hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const oldPrice = book.price ? (book.price * 1.25).toFixed(2) : null;
            return (
              <Link key={book._id} to={`/product/${book._id}`} className="book-card group flex flex-col">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                  <img
                    src={book.coverImage?.url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300"; }}
                  />
                  {oldPrice && (
                    <span className="absolute top-2 left-2 bg-[#e67e22] text-white text-[9px] font-black px-2 py-0.5 rounded-md">
                      -{Math.round(((oldPrice - book.price) / oldPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <StarRating />
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#1a3a2a] transition">
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium capitalize">{book.category}</p>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <div>
                      <span className="font-black text-gray-900">${(book.price || 0).toFixed(2)}</span>
                      {oldPrice && <span className="price-old ml-1.5 text-xs">${oldPrice}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); dispatch(addToCart(book)); }}
                      className="p-2 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white rounded-lg transition cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1a3a2a] hover:underline">
            View All Books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Trending;
