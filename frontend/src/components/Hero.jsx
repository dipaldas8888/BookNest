import { Link } from "react-router-dom";
import { Search, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import book1 from "../assets/books/book-1.png";
import book2 from "../assets/books/book-2.png";
import book3 from "../assets/books/book-3.png";
import book4 from "../assets/books/book-4.png";
import book5 from "../assets/books/book-5.png";
import book6 from "../assets/books/book-6.png";

const floatingCovers = [book1, book2, book3, book4, book5, book6];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    let query = "";
    if (searchQuery.trim()) {
      query += `search=${encodeURIComponent(searchQuery.trim())}`;
    }
    if (selectedCat) {
      if (query) query += "&";
      query += `category=${selectedCat}`;
    }
    navigate(`/products?${query}`);
  };

  return (
    <section className="bg-[#1a3a2a] relative overflow-hidden">
      {/* Ambient glow spots */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2d5a40]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#e67e22]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left: Copy */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
            <Star className="w-3 h-3 fill-[#e67e22] text-[#e67e22]" />
            Premium Bookstore
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            THE NEXT{" "}
            <span className="text-[#e67e22]">CHAPTER</span>
            {" "}IN YOUR
            <br />
            <span className="text-white">READING JOURNEY</span>
          </h1>

          <p className="text-white/65 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Browse a curated collection of page-turners, slow burns, and life-changing reads crafted to match your unique taste.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-0 bg-white rounded-xl overflow-hidden shadow-lg max-w-lg mx-auto lg:mx-0 border border-gray-200">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-3 py-3.5 text-sm font-semibold text-gray-700 border-r border-gray-200 bg-gray-50 focus:outline-none cursor-pointer shrink-0"
            >
              <option value="">All Categories</option>
              <option value="fiction">Fiction</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="adventure">Adventure</option>
              <option value="self-help">Self Help</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1 million books by title, author or ISBN"
              className="flex-1 px-4 py-3.5 text-sm text-gray-800 focus:outline-none bg-white min-w-0"
            />
            <button
              type="submit"
              className="bg-[#e67e22] hover:bg-[#d35400] text-white px-5 py-3.5 font-bold text-sm transition shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-center lg:justify-start gap-6 text-white/60 text-xs font-semibold">
            <span>✦ 10,000+ Titles</span>
            <span>✦ Free Shipping over ₹500</span>
            <span>✦ 30-day Returns</span>
          </div>
        </div>

        {/* Right: Floating book covers grid */}
        <div className="hidden lg:grid grid-cols-3 gap-4 place-items-center">
          {floatingCovers.map((cover, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 ${
                i % 3 === 1 ? "mt-8" : i % 3 === 2 ? "mt-4" : ""
              }`}
              style={{ animation: `float ${2.5 + i * 0.4}s ease-in-out infinite alternate` }}
            >
              <img
                src={cover}
                alt="book cover"
                className="w-24 h-32 object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
}
