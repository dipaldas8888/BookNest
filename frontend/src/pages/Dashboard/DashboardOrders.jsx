import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import endpoints from "../../api/endpoints";
import { Trash2, Loader2, AlertCircle, ShoppingBag, Search, Calendar, DollarSign } from "lucide-react";

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <span className="text-gray-500 font-medium">Fetching orders...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Store Orders <ShoppingBag className="w-6 h-6 text-purple-600" />
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View, track, and delete customer purchases made across the store.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg flex items-center gap-2">
          <span className="font-semibold">Success:</span> {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div 
            key={order._id} 
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
          >
            {/* Header info */}
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-sm">Order #{order._id}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                    {order.status || "completed"}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-450">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
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
              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <p className="text-xs text-gray-450 font-medium">Total Amount</p>
                  <p className="font-extrabold text-gray-800 text-lg">${(order.totalAmount || 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="text-red-500 hover:text-red-700 p-2.5 rounded-xl hover:bg-red-50 transition"
                  title="Delete Order"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content info */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div className="space-y-2 border-b md:border-b-0 md:border-r border-gray-150 pb-4 md:pb-0 md:pr-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</h4>
                {order.user ? (
                  <div>
                    <p className="font-semibold text-gray-800">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 rounded px-2 py-0.5 inline-block mt-1 uppercase">
                      Role: {order.user.role}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">User account deleted / unavailable</p>
                )}
              </div>

              {/* Items bought */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Items ({order.items?.length || 0})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items?.map((item, idx) => {
                    const book = item.book;
                    return (
                      <div key={idx} className="flex gap-3 items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                        <img
                          src={book?.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"}
                          alt={book?.title || "Book"}
                          className="w-8 h-10 object-cover rounded bg-white shadow-sm border border-gray-150"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{book?.title || "Unknown Book"}</p>
                          <p className="text-[10px] text-gray-450 mt-0.5">
                            Price: ${(book?.newPrice || book?.price || 0).toFixed(2)} | Qty: {item.quantity || 1}
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
          <div className="text-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 font-medium">
            No orders found matching the filter
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOrders;
