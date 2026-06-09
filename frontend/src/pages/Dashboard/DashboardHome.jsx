import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import endpoints from "../../api/endpoints";
import { 
  BookOpen, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Loader2, 
  TrendingUp,
  FileText
} from "lucide-react";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    booksCount: 0,
    ordersCount: 0,
    usersCount: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch books, orders, and users in parallel
        const [booksRes, ordersRes, usersRes] = await Promise.all([
          API.get(endpoints.books.all),
          API.get(endpoints.orders.allOrders),
          API.get(endpoints.users.all),
        ]);

        const books = booksRes.data.books || [];
        const orders = ordersRes.data.orders || [];
        const users = usersRes.data.users || [];

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        setStats({
          booksCount: books.length,
          ordersCount: orders.length,
          usersCount: users.length,
          revenue: totalRevenue,
        });

        // Set recent items (latest 5)
        setRecentOrders(orders.slice(0, 5));
        setRecentBooks(books.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error("Error fetching overview stats:", err);
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <span className="text-gray-500 font-medium">Loading metrics...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      description: "Net earnings from sales",
    },
    {
      title: "Books Catalog",
      value: stats.booksCount,
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      description: "Active titles in store",
    },
    {
      title: "Orders Processed",
      value: stats.ordersCount,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      description: "Total completed sales",
    },
    {
      title: "Registered Users",
      value: stats.usersCount,
      icon: Users,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      description: "Total customer profiles",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 px-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Dashboard Overview <TrendingUp className="w-6 h-6 text-purple-600" />
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome to the BookNest bookstore control center. Here is your store's performance at a glance.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`p-6 bg-white rounded-2xl border shadow-sm flex items-center justify-between hover:shadow-md transition duration-200`}
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                <p className="text-xs text-gray-400">{card.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main sections grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              Recent Orders
            </h2>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-gray-800">Order #{order._id.substring(18)}</p>
                  <p className="text-xs text-gray-500">By: {order.user?.name || "Customer"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${(order.totalAmount || 0).toFixed(2)}</p>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-55 text-green-700 bg-green-50 border border-green-200">
                    {order.status || "completed"}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-center py-6 text-gray-400 text-sm">No orders recorded yet</p>
            )}
          </div>
        </div>

        {/* Recently Added Books */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Recently Added Books
            </h2>
          </div>
          <div className="space-y-4">
            {recentBooks.map((book) => (
              <div key={book._id} className="flex items-center gap-4 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <img 
                  src={book.coverImage?.url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"} 
                  alt={book.title} 
                  className="w-10 h-12 object-cover rounded-md bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{book.title}</p>
                  <p className="text-xs text-purple-600 font-medium capitalize">{book.category}</p>
                </div>
                <div className="text-right font-bold text-gray-800">
                  ${(book.newPrice || book.price || 0).toFixed(2)}
                </div>
              </div>
            ))}
            {recentBooks.length === 0 && (
              <p className="text-center py-6 text-gray-400 text-sm">No books found in store</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
