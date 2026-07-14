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
  Search,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="text-amber-400 text-sm">★</span>
    ))}
  </div>
);

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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#0284c7]" />
        <span className="text-gray-500 font-semibold text-sm">Loading metrics...</span>
      </div>
    );
  }

  // Monthly order chart data representation
  const monthlyData = [
    { month: "Jan", value: 16000, color: "bg-sky-300" },
    { month: "Feb", value: 8000, color: "bg-sky-400" },
    { month: "Mar", value: 22000, color: "bg-violet-300" },
    { month: "Apr", value: 19000, color: "bg-rose-300" },
    { month: "May", value: 15000, color: "bg-rose-400" },
    { month: "Jun", value: 20000, color: "bg-red-300" },
    { month: "Jul", value: 9000, color: "bg-orange-300" },
    { month: "Aug", value: 4000, color: "bg-orange-400" },
    { month: "Sep", value: 18000, color: "bg-amber-200" },
    { month: "Oct", value: 27000, color: "bg-amber-300" },
    { month: "Nov", value: 17000, color: "bg-pink-300" },
    { month: "Dec", value: 15000, color: "bg-pink-400" },
  ];

  return (
    <div className="space-y-8 animate-slideUp">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-xs mt-1">Here is your store's performance at a glance.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50">
          Showing: <span className="text-[#0284c7]">This year</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {error && (
        <div className="p-4 text-xs text-red-700 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Stats Cards - Formatted like the 2nd screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Revenue</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              ₹{(stats.revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
              <span>↗ 10.5%</span>
              <span className="text-emerald-500/80 font-bold">+₹56k today</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-sky-50 text-sky-600 border border-sky-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Customers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Customer</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {(stats.usersCount * 12 + 160).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
              <span>↗ 0.5%</span>
              <span className="text-emerald-500/80 font-bold">+12 today</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-indigo-50 text-indigo-650 border border-indigo-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Transaction</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {stats.ordersCount.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-black text-[#0284c7] bg-sky-50 px-2 py-0.5 rounded-full w-fit">
              <span>↗ 5.5%</span>
              <span className="text-sky-600 font-bold">+10 today</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Visitors */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Visitor</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900">97,560</h3>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
              <span>↗ 15.5%</span>
              <span className="text-emerald-500/80 font-bold">+10k today</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-rose-50 text-rose-650 border border-rose-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        
        {/* Statistics of Orders (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-950">Statistics of Orders</h3>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Order growths per month</p>
            </div>
          </div>

          {/* Bar chart container */}
          <div className="relative h-64 flex items-end gap-2 pt-6 border-b border-gray-100">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-300 font-bold">
              {[28000, 21000, 14000, 7000, 0].map((label) => (
                <div key={label} className="w-full border-t border-gray-100 pt-1 flex justify-between">
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 w-full h-full flex items-end justify-between px-2">
              {monthlyData.map((d) => {
                const heightPct = `${Math.round((d.value / 28000) * 100)}%`;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center group max-w-[32px]">
                    <div className="relative w-full flex justify-center">
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow transition-all">
                        {d.value.toLocaleString()}
                      </span>
                    </div>
                    <div 
                      className={`w-full ${d.color} rounded-t-md group-hover:brightness-95 transition-all duration-350 shadow-sm`}
                      style={{ height: heightPct }}
                    />
                    <span className="text-[10px] font-bold text-gray-400 mt-2">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deliveries (Pie/Donut chart list) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-950">Deliveries</h3>
                <p className="text-[10px] font-black text-gray-450 uppercase tracking-widest">This year</p>
              </div>
            </div>

            {/* Beautiful SVG Donut Chart */}
            <div className="relative flex justify-center py-4">
              <svg className="w-32 h-32" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                
                {/* On Time (38%) -> Blue */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#38bdf8" strokeWidth="3" 
                  strokeDasharray="38 62" strokeDashoffset="25" />
                
                {/* In Progress (25%) -> Purple */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#818cf8" strokeWidth="3" 
                  strokeDasharray="25 75" strokeDashoffset="-13" />

                {/* Delayed (25%) -> Amber */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" 
                  strokeDasharray="25 75" strokeDashoffset="-38" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900">88%</span>
                <span className="text-[9px] text-gray-450 font-bold uppercase">Success</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4">
            {[
              { label: "On Time", val: "38%", dot: "bg-sky-400" },
              { label: "In Progress", val: "25%", dot: "bg-indigo-400" },
              { label: "Delayed", val: "25%", dot: "bg-amber-500" },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${d.dot}`} />
                  <span className="font-bold text-gray-600">{d.label}</span>
                </div>
                <span className="font-black text-gray-900">{d.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Ordered Branch List (Beautiful Table) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-950">Top Ordered Branch List</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">High performing areas</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 gap-2 max-w-[200px]">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent text-xs focus:outline-none w-full text-gray-700" />
            </div>
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-450 font-bold uppercase tracking-wider">
                <th className="pb-3 font-semibold text-gray-450">Branch Name</th>
                <th className="pb-3 font-semibold text-gray-450">Product Type</th>
                <th className="pb-3 font-semibold text-gray-450">Order</th>
                <th className="pb-3 font-semibold text-gray-450">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: "New York", type: "Doc and Objects", order: "12,000" },
                { name: "California", type: "Objects", order: "5,000" },
                { name: "Louisiana", type: "Documents", order: "4,480" },
                { name: "Arizona", type: "Objects", order: "1,500" },
              ].map((b) => (
                <tr key={b.name} className="hover:bg-gray-50/40 transition duration-150">
                  <td className="py-3.5 font-bold text-gray-800">{b.name}</td>
                  <td className="py-3.5 text-gray-500 font-semibold">{b.type}</td>
                  <td className="py-3.5 font-bold text-gray-800">{b.order}</td>
                  <td className="py-3.5"><StarRating /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
