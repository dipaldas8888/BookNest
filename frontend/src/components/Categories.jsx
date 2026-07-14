import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import API from "../api/axios";
import endpoints from "../api/endpoints";

const categoriesMetadata = [
  {
    name: "Fiction",
    slug: "fiction",
    tagline: "Escape into another world",
    color: "from-emerald-900 to-emerald-700",
    img: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&q=80",
  },
  {
    name: "Business",
    slug: "business",
    tagline: "Build your empire",
    color: "from-amber-800 to-amber-600",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
  },
  {
    name: "Technology",
    slug: "technology",
    tagline: "Shape the future",
    color: "from-blue-900 to-blue-700",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    name: "Self Help",
    slug: "self-help",
    tagline: "Unlock your potential",
    color: "from-purple-900 to-purple-700",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    name: "Adventure",
    slug: "adventure",
    tagline: "Chase the horizon",
    color: "from-red-900 to-red-700",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  },
  {
    name: "Science",
    slug: "science",
    tagline: "Explore the unknown",
    color: "from-teal-900 to-teal-700",
    img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80",
  },
];

export default function Categories() {
  const [activeCategories, setActiveCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API.get(endpoints.books.all + "?limit=100");
        const books = res.data.books || [];
        
        // Find all unique categories that have at least one book
        const bookCategories = new Set(
          books
            .map((b) => b.category?.toLowerCase().trim())
            .filter(Boolean)
        );

        // Filter metadata to only include categories that actually have books
        const filtered = categoriesMetadata.filter((cat) =>
          bookCategories.has(cat.slug) || 
          bookCategories.has(cat.name.toLowerCase())
        );

        // If no matching books exist yet, default to showing all of them
        if (filtered.length === 0) {
          setActiveCategories(categoriesMetadata);
        } else {
          setActiveCategories(filtered);
        }
      } catch (err) {
        console.error("Failed to load active categories:", err);
        setActiveCategories(categoriesMetadata);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3a2a]" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-white animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="section-tag mb-2">BOOK CATEGORIES</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            What kind of story are you <br className="hidden sm:block" />
            craving today?
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {activeCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer h-36 md:h-44 bg-gradient-to-br ${cat.color} hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-md`}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
              />
              <div className="relative z-10 h-full flex flex-col justify-end p-5">
                <p className="text-white/70 text-xs font-semibold">{cat.tagline}</p>
                <div className="flex items-center justify-between mt-1">
                  <h3 className="text-white font-black text-lg">{cat.name}</h3>
                  <div className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition group-hover:bg-white group-hover:text-gray-900">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-gray-900" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
