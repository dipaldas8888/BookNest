import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import endpoints from "../api/endpoints";
import { addToCart } from "../redux/features/cartSlice";
import { toast } from "react-toastify";
import {
  ShoppingBag, ArrowLeft, BookOpen, Loader2, Star,
  ShieldCheck, Truck, RefreshCw, ChevronRight, Package,
  CreditCard, Clock, Award
} from "lucide-react";

const StarRating = ({ rating = 4.3, count = 128 }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-[#e67e22] text-[#e67e22]" : "text-gray-200"}`} />
      ))}
    </div>
    <span className="text-sm font-bold text-gray-700">{rating}</span>
    <span className="text-sm text-gray-400">({count} reviews)</span>
  </div>
);

const deliveryFeatures = [
  { icon: Truck, label: "Free Delivery", sub: "Orders above ₹500" },
  { icon: RefreshCw, label: "30-Day Returns", sub: "No questions asked" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "Razorpay protected" },
  { icon: Package, label: "Original Books", sub: "100% authentic" },
];

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    API.get(endpoints.books.single(id))
      .then((res) => { setBook(res.data.book); setError(null); })
      .catch(() => setError("Failed to load book. It may have been removed."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      for (let i = 0; i < qty; i++) dispatch(addToCart(book));
      setAdded(true);
      toast.success(`${qty}x "${book.title}" added to cart!`);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#1a3a2a]" />
          <p className="text-gray-500 font-medium text-sm">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
          <BookOpen className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Book Not Found</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs">{error || "Could not retrieve this book."}</p>
        <Link to="/products"
          className="inline-flex items-center gap-2 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white font-bold py-2.5 px-6 rounded-xl transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const oldPrice = book.price ? (book.price * 1.25).toFixed(2) : null;
  const savings = oldPrice ? (oldPrice - book.price).toFixed(2) : 0;
  const rating = { "fiction": 4.5, "business": 4.7, "technology": 4.4, "adventure": 4.2, "self-help": 4.8 }[book.category?.toLowerCase()] || 4.3;

  return (
    <div className="bg-[#f9f7f4] min-h-screen animate-fadeIn">
      {/* Top banner */}
      <div className="bg-[#1a3a2a] text-white text-center py-2.5 text-xs font-semibold">
        🚚 Free delivery on orders above ₹500 &nbsp;|&nbsp; Use code <span className="font-black text-[#e67e22]">BOOK10</span> for 10% off
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-8">
          <Link to="/" className="hover:text-gray-900 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-gray-900 transition">Books</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-bold truncate max-w-xs">{book.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── Left: Book Cover ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] border border-gray-200 bg-white">
                <img
                  src={book.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.trending && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#e67e22] text-white text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Award className="w-3 h-3" /> Bestseller
                    </span>
                  </div>
                )}
                {oldPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow">
                    -{Math.round(((oldPrice - book.price) / oldPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Small guarantee badges */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {deliveryFeatures.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
                    <Icon className="w-4 h-4 text-[#1a3a2a] shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-gray-800">{label}</p>
                      <p className="text-[10px] text-gray-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Category + title */}
            <div>
              <span className="category-pill">{book.category}</span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mt-3">{book.title}</h1>
              <p className="text-gray-500 text-sm mt-1">Genre: <span className="font-semibold capitalize">{book.category}</span></p>
            </div>

            <StarRating rating={rating} />

            {/* Price block */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-black text-gray-900">₹{(book.price || 0).toFixed(2)}</span>
                {oldPrice && <span className="text-lg price-old">₹{oldPrice}</span>}
                {savings > 0 && <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">You save ₹{savings}!</span>}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes. Free delivery on orders above ₹500.</p>

              {/* Quantity selector */}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm font-bold text-gray-700">Qty:</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition font-bold text-lg cursor-pointer">−</button>
                  <span className="px-4 py-2 font-black text-gray-900 text-sm min-w-[40px] text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition font-bold text-lg cursor-pointer">+</button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mt-5">
                <button onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition cursor-pointer shadow-sm ${
                    added ? "bg-green-600 text-white" : "bg-[#1a3a2a] hover:bg-[#2d5a40] text-white"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>
                <Link to="/cart"
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm border-2 border-[#1a3a2a] text-[#1a3a2a] hover:bg-[#1a3a2a] hover:text-white transition">
                  Buy Now →
                </Link>
              </div>
            </div>

            {/* Razorpay payment methods banner */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Secure Payment Options
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {["Razorpay", "UPI", "Credit Card", "Debit Card", "Net Banking", "EMI"].map((method) => (
                  <span key={method} className="text-[11px] font-bold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                    {method}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                🔒 Payments are 256-bit SSL encrypted via Razorpay Test Mode
              </p>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1a3a2a]" /> About this Book
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
            </div>

            {/* Delivery estimate */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1a3a2a]/5 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#1a3a2a]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Estimated Delivery</p>
                <p className="text-gray-500 text-xs mt-0.5">Order now and receive within <span className="font-bold text-[#1a3a2a]">2–4 business days</span></p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-green-600 font-bold">In Stock ✓</p>
                <p className="text-[11px] text-gray-400">Ready to ship</p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom image banner */}
        <div className="mt-16 rounded-2xl overflow-hidden relative h-36 bg-[#1a3a2a]">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=70"
            alt="books collection"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="relative z-10 h-full flex items-center justify-between px-8">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">LIMITED OFFER</p>
              <h3 className="text-white font-black text-xl sm:text-2xl">Use code <span className="text-[#e67e22]">BOOKNEST20</span> — get 20% off your cart</h3>
            </div>
            <Link to="/cart" className="shrink-0 bg-white text-[#1a3a2a] font-black text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
