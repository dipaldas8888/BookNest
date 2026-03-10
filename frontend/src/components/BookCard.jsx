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

  return (
    <div className="rounded-2xl shadow-md hover:shadow-lg transition flex bg-gray-100 overflow-hidden">
      <img
        onClick={handleClick}
        src={book.coverImage?.url}
        alt={book.title}
        className="w-[180px] h-[250px] object-cover"
      />

      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <h3 className="font-semibold text-md">{book.title}</h3>

          <p className="text-gray-500 text-sm mt-1">{book.category}</p>

          <p className="font-bold mt-3 text-lg">${book.price}</p>
        </div>

        <button
          onClick={() => dispatch(addToCart(book))}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium py-2 rounded-lg mt-4"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;
