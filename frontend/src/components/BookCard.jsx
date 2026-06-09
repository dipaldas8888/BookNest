import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cartSlice";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${book._id}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addToCart(book));
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer h-full"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border-b border-gray-100">
        <img
          src={book.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {book.trending && (
          <span className="absolute top-3 left-3 bg-purple-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
            Trending
          </span>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
            {book.category}
          </span>
          <h3 className="font-bold text-gray-800 text-sm mt-1 line-clamp-2 group-hover:text-purple-650 transition">
            {book.title}
          </h3>
        </div>

        <div className="pt-2 flex items-center justify-between gap-2">
          <span className="font-extrabold text-gray-900 text-base">
            ${(book.price || 0).toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
