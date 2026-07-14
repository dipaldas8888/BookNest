import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import endpoints from "../../api/endpoints";
import { Trash2, Loader2, AlertCircle, ShoppingBag, Search, Calendar, Check, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get(endpoints.orders.allOrders);
      setOrders(res.data.orders || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch store orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

    try {
      setSuccessMessage("");
      const res = await API.delete(endpoints.orders.delete(orderId));
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      setSuccessMessage(res.data.message || "Order deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.name?.toLowerCase() || "";
    const customerEmail = order.user?.email?.toLowerCase() || "";
    const orderIdStr = order._id?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      customerName.includes(query) ||
      customerEmail.includes(query) ||
      orderIdStr.includes(query)
    );
  });

  // Pagination Logic
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page on search filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 animate-fadeIn">
        <Loader2 className="w-10 h-10 animate-spin text-[#0284c7]" />
        <span className="text-gray-500 font-semibold text-sm">Fetching orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Manage Orders <ShoppingBag className="w-5 h-5 text-[#0284c7]" />
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            View, track, and delete customer purchases made across the store.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-250 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#0284c7] text-gray-700"
          />
        </div>
      </div>

      {successMessage && (
        <div className="p-4 text-xs font-bold text-green-700 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
          <Check className="w-4.5 h-4.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-xs text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
          <div 
            key={order._id} 
            className="bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            {/* Header info */}
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm">Order #{order._id.substring(18).toUpperCase()}</span>
                  <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-150">
                    {order.status || "completed"}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold bg-gray-100 px-2 py-1 rounded-md">
                    ID: {order._id}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-455 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Delete & Totals */}
              <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Total Amount</p>
                  <p className="font-black text-gray-900 text-lg">₹{(order.totalAmount || 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="text-red-500 hover:text-red-700 p-2.5 rounded-xl hover:bg-red-50 transition cursor-pointer"
                  title="Delete Order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content info */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
              {/* Customer Info */}
              <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Customer Details</h4>
                {order.user ? (
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 text-sm">{order.user.name}</p>
                    <p className="text-xs text-gray-500 break-all">{order.user.email}</p>
                    <span className="text-[9px] font-black bg-sky-50 text-[#0284c7] border border-sky-100 rounded px-2 py-0.5 inline-block uppercase tracking-wider mt-1">
                      {order.user.role} Account
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-450 italic">User account deleted / unavailable</p>
                )}
              </div>

              {/* Items bought */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Order Items ({order.items?.length || 0})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items?.map((item, idx) => {
                    const book = item.book;
                    return (
                      <div key={idx} className="flex gap-3 items-center bg-gray-50/40 p-2.5 rounded-xl border border-gray-100">
                        <img
                          src={book?.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"}
                          alt={book?.title || "Book"}
                          className="w-8 h-11 object-cover rounded bg-white shadow-sm border border-gray-150 shrink-0"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <p className="font-bold text-gray-900 truncate">{book?.title || "Unknown Book"}</p>
                          <p className="text-[10px] text-gray-450 mt-0.5">
                            Price: ₹{(book?.price || 0).toFixed(2)} | Qty: {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-150 rounded-2xl shadow-sm text-gray-400 font-bold text-xs">
            No orders found matching the filter
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-white px-6 py-4 border border-gray-150 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="text-xs text-gray-500 font-semibold">
            Showing <span className="font-black text-gray-900">{startIndex + 1}</span> to{" "}
            <span className="font-black text-gray-900">{endIndex}</span> of{" "}
            <span className="font-black text-gray-900">{totalItems}</span> orders
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
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
  );
};

export default DashboardOrders;
