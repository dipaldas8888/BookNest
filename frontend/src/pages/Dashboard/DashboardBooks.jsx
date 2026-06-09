import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import endpoints from "../../api/endpoints";
import { Plus, Edit2, Trash2, Loader2, X, Upload, Check } from "lucide-react";

const DashboardBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null); // If null, we are adding. If not, we are editing.
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
      const res = await API.get(endpoints.books.all);
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
        // Update Book
        const res = await API.put(endpoints.books.update(editingBookId), submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Book updated successfully!");
        setBooks((prev) =>
          prev.map((b) => (b._id === editingBookId ? res.data.book : b))
        );
      } else {
        // Create Book
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <span className="text-gray-500 font-medium">Fetching books...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Books Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse and manage all book listings in your online store.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md shadow-purple-600/10 transition duration-200"
        >
          <Plus className="w-5 h-5" /> Add Book
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Book info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trending</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50/50 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={book.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded bg-gray-50 shadow-sm border border-gray-100"
                      />
                      <div className="max-w-xs">
                        <div className="font-semibold text-gray-800 truncate">{book.title}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{book.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium capitalize">
                    {book.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-850 font-bold">
                    ${(book.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.trending ? (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                        Trending
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-200">
                        Regular
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(book)}
                        className="text-purple-600 hover:text-purple-800 transition duration-150 p-2 rounded-lg hover:bg-purple-50"
                        title="Edit Book"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-lg hover:bg-red-50"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500 font-medium">
                    No books listed in catalog
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-scaleUp">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingBookId ? "Edit Book Listing" : "Add New Book"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Book Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  placeholder="e.g. The Great Gatsby"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  placeholder="A short description of the book..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="fiction">Fiction</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="adventure">Adventure</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    placeholder="e.g. 19.99"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="trending"
                  name="trending"
                  checked={formData.trending}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="trending" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Feature on Trending list
                </label>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase block">Cover Image</label>
                <div className="flex gap-4 items-center">
                  {coverImagePreview && (
                    <img
                      src={coverImagePreview}
                      alt="Cover Preview"
                      className="w-16 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-purple-400 rounded-xl p-4 cursor-pointer hover:bg-purple-50/10 transition">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-bold text-gray-650">
                      {coverImageFile ? coverImageFile.name : "Upload Cover Image"}
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

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-100 hover:bg-gray-205 text-gray-700 font-bold py-2 px-4 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl shadow-md shadow-purple-650/10 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBookId ? "Save Changes" : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBooks;
