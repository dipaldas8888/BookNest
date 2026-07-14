import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import API from "../../api/axios";
import endpoints from "../../api/endpoints";
import { Plus, Edit2, Trash2, Loader2, X, Upload, Check, Search, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const DashboardBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    trending: false,
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await API.get(endpoints.books.all + "?limit=100");
      setBooks(res.data.books || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openAddModal = () => {
    setEditingBookId(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      trending: false,
    });
    setCoverImageFile(null);
    setCoverImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBookId(book._id);
    setFormData({
      title: book.title || "",
      description: book.description || "",
      category: book.category || "",
      price: book.price || "",
      trending: book.trending || false,
    });
    setCoverImageFile(null);
    setCoverImagePreview(book.coverImage?.url || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBookId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);
    submissionData.append("category", formData.category);
    submissionData.append("price", formData.price);
    submissionData.append("trending", formData.trending);
    
    if (coverImageFile) {
      submissionData.append("coverImage", coverImageFile);
    }

    try {
      if (editingBookId) {
        const res = await API.put(endpoints.books.update(editingBookId), submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Book updated successfully!");
        setBooks((prev) =>
          prev.map((b) => (b._id === editingBookId ? res.data.book : b))
        );
      } else {
        if (!coverImageFile) {
          throw new Error("Cover image is required when creating a book.");
        }
        const res = await API.post(endpoints.books.create, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Book added successfully!");
        setBooks((prev) => [res.data.book, ...prev]);
      }
      closeModal();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book? This will permanently remove the book and its image.")) return;

    try {
      setSuccessMessage("");
      await API.delete(endpoints.books.delete(id));
      setBooks((prev) => prev.filter((b) => b._id !== id));
      setSuccessMessage("Book deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete book");
    }
  };

  // Filter & Search
  const filteredBooks = books.filter((b) =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 animate-fadeIn">
        <Loader2 className="w-10 h-10 animate-spin text-[#0284c7]" />
        <span className="text-gray-550 font-semibold text-sm">Fetching books...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Books Catalog</h1>
          <p className="text-gray-550 text-xs mt-1">Browse and manage all book listings in your online store.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0284c7]/95 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer text-xs"
        >
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      {successMessage && (
        <div className="p-4 text-xs font-bold text-green-700 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
          <Check className="w-4.5 h-4.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 gap-2 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-xs focus:outline-none w-full text-gray-700"
        />
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-450 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold text-gray-500">Book Info</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Price</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50/20 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={book.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded-lg bg-gray-50 shadow-sm border border-gray-100 shrink-0"
                      />
                      <div className="max-w-xs">
                        <div className="font-bold text-gray-900 text-sm truncate">{book.title}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5 line-clamp-1">{book.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-bold capitalize">
                    {book.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-black">
                    ₹{(book.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.trending ? (
                      <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                        Trending
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-200">
                        Regular
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(book)}
                        className="text-[#0284c7] hover:text-[#0369a1] transition duration-150 p-2 rounded-xl hover:bg-sky-50 cursor-pointer"
                        title="Edit Book"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-xl hover:bg-red-50 cursor-pointer"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedBooks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 font-bold">
                    No books listed in catalog
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500 font-semibold">
              Showing <span className="font-black text-gray-900">{startIndex + 1}</span> to{" "}
              <span className="font-black text-gray-900">{endIndex}</span> of{" "}
              <span className="font-black text-gray-900">{totalItems}</span> books
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-655" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl font-bold transition text-xs border ${
                    currentPage === i + 1
                      ? "bg-[#0284c7] border-[#0284c7] text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  } cursor-pointer`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-gray-655" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Book Form Modal - Rendered via React Portal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-gray-200 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-sm font-black text-gray-900">
                  {editingBookId ? "Edit Book Details" : "Add New Book Listing"}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-0.5">
                  {editingBookId ? "Update existing bookstore entry" : "Create a new bookstore database entry"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-450 hover:text-gray-700 hover:bg-gray-150 p-2 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6.5 space-y-4 text-xs">
              {error && (
                <div className="p-3.5 text-red-700 bg-red-50 rounded-xl border border-red-100 font-bold">
                  {error}
                </div>
              )}

              {/* Book Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Book Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] text-gray-900 font-medium placeholder-gray-400 transition"
                  placeholder="e.g. Atomic Habits"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] text-gray-900 font-medium placeholder-gray-400 resize-none transition"
                  placeholder="Provide a summary or outline of this book..."
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] text-gray-900 font-medium cursor-pointer transition"
                  >
                    <option value="">Select Category</option>
                    <option value="fiction">Fiction</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="self-help">Self Help</option>
                    <option value="adventure">Adventure</option>
                    <option value="science">Science</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] text-gray-900 font-medium placeholder-gray-400 transition"
                    placeholder="e.g. 399.00"
                  />
                </div>
              </div>

              {/* Trending option */}
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                <input
                  type="checkbox"
                  id="trending"
                  name="trending"
                  checked={formData.trending}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#0284c7] focus:ring-[#0284c7]/20 cursor-pointer accent-[#0284c7]"
                />
                <div className="cursor-pointer">
                  <label htmlFor="trending" className="text-xs font-bold text-gray-800 cursor-pointer block leading-none">
                    Feature on Trending list
                  </label>
                  <span className="text-[9px] text-gray-500 mt-1 block">Checking this will place the book on the home page bestseller grid.</span>
                </div>
              </div>

              {/* Image upload block */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Cover Image</label>
                <div className="flex gap-4 items-center">
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview}
                      alt="Cover Preview"
                      className="w-14 h-20 object-cover rounded-xl border border-gray-200 shadow-sm shrink-0 bg-gray-50"
                    />
                  ) : (
                    <div className="w-14 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-450 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#0284c7] hover:bg-sky-50/5 rounded-2xl p-4.5 cursor-pointer transition">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-[10px] font-black text-[#0284c7] uppercase tracking-wider">
                      {coverImageFile ? "Change Image" : "Choose Image File"}
                    </span>
                    <span className="text-[9px] text-gray-400 mt-0.5">
                      {coverImageFile ? coverImageFile.name : "JPEG or PNG formats"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required={!editingBookId}
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold py-2.5 px-4.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0284c7] hover:bg-[#0284c7]/95 text-white font-bold py-2.5 px-4.5 rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBookId ? "Save Changes" : "Publish Book"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DashboardBooks;
