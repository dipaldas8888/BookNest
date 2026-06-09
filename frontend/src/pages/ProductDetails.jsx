import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import endpoints from "../api/endpoints";
import { addToCart } from "../redux/features/cartSlice";
import { ShoppingBag, ArrowLeft, BookOpen, Loader2, Award } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await API.get(endpoints.books.single(id));
      setBook(res.data.book);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load book details. It may not exist or has been removed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      dispatch(addToCart(book));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <span className="text-gray-500 font-medium">Loading book details...</span>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "Could not retrieve the requested book details."}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bookstore
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8">
          <nav className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-purple-600 transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-purple-600 transition">Books</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs">{book.title}</span>
          </nav>
          
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        {/* Book Information Grid */}
        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-start pb-12 border-b border-gray-100">
          {/* Cover Image */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-[260px] w-full">
              <div className="absolute inset-0 bg-purple-650/10 rounded-2xl blur-xl group-hover:blur-2xl transition duration-300 opacity-60"></div>
              <img
                src={book.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400"}
                alt={book.title}
                className="relative w-full h-[370px] object-cover rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-gray-100 hover:scale-[1.01] transition duration-300"
              />
              {book.trending && (
                <span className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Best Seller
                </span>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="inline-block bg-purple-50 text-purple-600 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-lg border border-purple-100 mb-3">
                {book.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {book.title}
              </h1>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-500">
                ${(book.price || 0).toFixed(2)}
              </span>
            </div>

            <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
              <p className="line-clamp-4">{book.description}</p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition duration-200 cursor-pointer w-full sm:w-auto ${
                  added 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200" 
                    : "bg-black hover:bg-zinc-800 text-white shadow-zinc-200"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Extra Information: About This Book */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            About this book
          </h2>
          <p className="text-gray-650 leading-relaxed text-sm sm:text-base max-w-4xl whitespace-pre-line">
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
