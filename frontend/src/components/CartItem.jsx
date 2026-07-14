import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/features/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const decrease = () => {
    if (item.quantity === 1) {
      dispatch(removeFromCart(item._id));
    } else {
      dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
    }
  };

  const increase = () => {
    dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }));
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl">
      {/* Book Cover */}
      <img
        src={item.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"}
        alt={item.title}
        className="w-16 h-20 object-cover rounded-xl border border-gray-100 shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm leading-snug truncate">{item.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">{item.category || "Book"}</p>
        <p className="font-black text-gray-900 text-base mt-2">${(item.price || 0).toFixed(2)}</p>
      </div>

      {/* Delete */}
      <button
        onClick={() => dispatch(removeFromCart(item._id))}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer shrink-0"
        title="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Quantity controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={decrease}
          className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-6 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
        <button
          onClick={increase}
          className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
