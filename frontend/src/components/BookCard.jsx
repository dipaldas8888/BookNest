import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cartSlice";

const ratingMap = {
  "fiction": 4.3, "business": 4.5, "technology": 4.4,
  "adventure": 4.2, "self-help": 4.6, "default": 4.0
};

const StarRating = ({ rating }) => {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < filled ? "fill-[#e67e22] text-[#e67e22]" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1 text-[10px] font-bold text-gray-400">({rating})</span>
    </div>
  );
};

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => navigate(`/product/${book._id}`);
  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addToCart(book));
  };

  const rating = ratingMap[book.category?.toLowerCase()] || ratingMap.default;
  const oldPrice = book.price ? (book.price * 1.2).toFixed(2) : null;

  return (
    <div
      onClick={handleClick}
      className="book-card group bg-white cursor-pointer flex flex-col h-full"
    >
      {/* Cover */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        <img
          src={book.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {book.trending && (
          <span className="absolute top-2 left-2 bg-[#e67e22] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow">
            Bestseller
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div>
          <StarRating rating={rating} />
          <h3 className="mt-1.5 font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#1a3a2a] transition-colors">
            {book.title}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5 font-medium capitalize">{book.category}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-gray-900 text-base">
              ${(book.price || 0).toFixed(2)}
            </span>
            {oldPrice && (
              <span className="price-old text-xs">${oldPrice}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white text-[11px] font-bold py-2 px-3 rounded-lg transition cursor-pointer shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
