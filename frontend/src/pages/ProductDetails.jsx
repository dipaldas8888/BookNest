import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import endpoints from "../api/endpoints";
import { addToCart } from "../redux/features/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [book, setbook] = useState(null);
  const fetchBook = async () => {
    try {
      const res = await API.get(endpoints.books.single(id));
      console.log(res);
      setbook(res.data.book);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBook();
  }, [id]);

  if (!book) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <p className="text-sm text-gray-500 mb-6">Home / Books / {book.title}</p>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={book.coverImage.url}
            alt={book.title}
            className="w-[220px] h-[310px] object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{book.category}</p>

          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

          <p className="text-2xl font-semibold text-yellow-600 mb-6">
            ${book.price}
          </p>

          <p className="text-gray-600 leading-relaxed mb-8">
            {book.description}
          </p>

          <button
            onClick={() => dispatch(addToCart(book))}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">About this book</h2>

        <p className="text-gray-600 leading-relaxed max-w-3xl">
          {book.description}
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
