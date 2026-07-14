import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { fetchBooks } from "../api/booksApi";
import { categories } from "../data/categories";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Loader2,
  LayoutGrid,
  List,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "title_asc", label: "Title: A → Z" },
  { value: "title_desc", label: "Title: Z → A" },
  { value: "trending", label: "Trending" },
];

const LIMIT_OPTIONS = [12, 24, 48];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [limit, setLimit] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("All");
    }

    const q = searchParams.get("search");
    if (q) {
      setSearchInput(q);
      setSearch(q);
    }
  }, [searchParams]);

  // Data state
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchRef = useRef(null);

  // Reset to page 1 on any filter change (except page itself)
  const resetPage = () => setCurrentPage(1);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchBooks({
        category: selectedCategory,
        search,
        minPrice,
        maxPrice,
        trending: trendingOnly,
        sortBy,
        page: currentPage,
        limit,
      });
      setBooks(result.books);
      setPagination(result.pagination);
    } catch (err) {
      console.error(err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, minPrice, maxPrice, trendingOnly, sortBy, currentPage, limit]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      resetPage();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (cat) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
    setSelectedCategory(cat);
    resetPage();
    setSidebarOpen(false);
  };

  const handlePriceApply = () => {
    resetPage();
    loadBooks();
  };

  const clearPriceRange = () => {
    setMinPrice("");
    setMaxPrice("");
    resetPage();
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSearchInput("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setTrendingOnly(false);
    setSortBy("newest");
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    search ||
    minPrice ||
    maxPrice ||
    trendingOnly ||
    sortBy !== "newest";

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8 animate-fadeIn">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Book Store
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination
              ? `${pagination.totalCount} book${pagination.totalCount !== 1 ? "s" : ""} found`
              : "Explore our collection"}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search books..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-200 bg-white rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(""); setSearch(""); resetPage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar (desktop always visible, mobile drawer) ── */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 h-full w-72 bg-white z-40 shadow-2xl overflow-y-auto transition-transform duration-300 lg:static lg:h-auto lg:w-64 lg:shadow-none lg:rounded-2xl lg:border lg:border-gray-100 lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-5 lg:p-5">
            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                Filters
              </h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); resetPage(); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Trending toggle */}
            <div className="mb-6">
              <button
                onClick={() => { setTrendingOnly(!trendingOnly); resetPage(); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                  trendingOnly
                    ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending Only
                </span>
                <div
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    trendingOnly ? "bg-white/30" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      trendingOnly ? "left-4" : "left-0.5"
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price Range
                </h3>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={clearPriceRange}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={() => { resetPage(); }}
                    className="w-full border border-gray-200 rounded-xl pl-6 pr-2 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <span className="text-gray-400 text-xs font-bold">–</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={() => { resetPage(); }}
                    className="w-full border border-gray-200 rounded-xl pl-6 pr-2 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Category
              </h3>
              <div className="space-y-1">
                {[{ id: 0, name: "All", icon: LayoutGrid }, ...categories].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Top bar: mobile filter btn + per-page + active filters */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm font-semibold shadow-sm hover:border-purple-400"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-purple-600" />
              )}
            </button>

            {/* Active filter chips */}
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedCategory !== "All" && (
                <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1 font-semibold border border-purple-200">
                  {selectedCategory}
                  <button onClick={() => { setSelectedCategory("All"); resetPage(); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {trendingOnly && (
                <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1 font-semibold border border-purple-200">
                  Trending
                  <button onClick={() => { setTrendingOnly(false); resetPage(); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1 font-semibold border border-purple-200">
                  ${minPrice || "0"} – ${maxPrice || "∞"}
                  <button onClick={clearPriceRange}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sortBy !== "newest" && (
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-semibold border border-gray-200">
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                  <button onClick={() => { setSortBy("newest"); resetPage(); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {/* Per-page selector */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden sm:inline text-xs font-medium">Show</span>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); resetPage(); }}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {LIMIT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="hidden sm:inline text-xs font-medium">per page</span>
            </div>
          </div>

          {/* Books grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
              <span className="text-gray-500 font-medium">Loading books...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
              <p className="text-red-500 font-semibold">{error}</p>
              <button
                onClick={loadBooks}
                className="bg-purple-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Retry
              </button>
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-700 font-bold text-lg">No books found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or search query
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-purple-600 hover:text-purple-800 font-semibold text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {pagination && pagination.totalPages > 1 && !loading && (
            <div className="mt-12 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2 justify-center">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-650 hover:border-purple-500 hover:text-purple-650 disabled:opacity-40 disabled:cursor-not-allowed transition bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    const cur = pagination.currentPage;
                    return p === 1 || p === pagination.totalPages || Math.abs(p - cur) <= 1;
                  })
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`dot-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold border transition ${
                          item === pagination.currentPage
                            ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
                            : "border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-700 bg-white"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-655 hover:border-purple-500 hover:text-purple-650 disabled:opacity-40 disabled:cursor-not-allowed transition bg-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-400 font-medium">
                Showing{" "}
                <span className="font-semibold text-gray-600">
                  {(pagination.currentPage - 1) * pagination.limit + 1}–
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalCount,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {pagination.totalCount}
                </span>{" "}
                books
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
