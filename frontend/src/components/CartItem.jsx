import React from "react";
import { Heart, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/features/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    dispatch(
      updateQuantity({
        id: item._id,
        quantity: Number(e.target.value),
      }),
    );
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex gap-4 items-center">
        <img
          src={item.coverImage?.url}
          alt={item.title}
          className="w-16 h-16 object-cover rounded"
        />

        <div>
          <h3 className="font-semibold text-sm">{item.title}</h3>

          <p className="text-xs text-gray-500">
            Price: ${item.price} / per item
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={item.quantity}
          onChange={handleQuantityChange}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>

        <button className="p-2 border rounded hover:bg-gray-100">
          <Heart size={16} />
        </button>

        <button
          onClick={() => dispatch(removeFromCart(item._id))}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <X size={16} />
        </button>

        <p className="font-semibold w-20 text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
