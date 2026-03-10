import { useEffect, useState } from "react";
import ProductCategory from "../components/ProductCategory";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { fetchBooks } from "../api/booksApi";

const Products = () => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBooks();
  }, [selectedCategory, search]);

  const loadBooks = async () => {
    const data = await fetchBooks(selectedCategory, search);
    setBooks(data);
  };

  return (
    <section className="max-w-7xl mx-auto p-6">
      <SearchBar setSearch={setSearch} />

      <h1 className="text-3xl font-bold mb-6">Book Store</h1>

      <ProductCategory setSelectedCategory={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default Products;
