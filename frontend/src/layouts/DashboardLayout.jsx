import React from "react";
import { Outlet, NavLink, Navigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  LayoutDashboard, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  Home, 
  LogOut,
  User as UserIcon,
  ChevronRight,
  Bell,
  Calendar
} from "lucide-react";
import { logoutUser } from "../redux/features/authSlice";

const DashboardLayout = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1a3a2a] border-t-transparent"></div>
          <span className="text-gray-500 font-semibold text-sm">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/books", label: "Manage Books", icon: BookOpen },
    { to: "/dashboard/orders", label: "Manage Orders", icon: ShoppingBag },
    { to: "/dashboard/users", label: "Manage Users", icon: Users },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] font-sans overflow-hidden">
      {/* Sidebar - Dark theme from 2nd screenshot */}
      <aside className="w-64 bg-[#111827] text-gray-300 flex flex-col justify-between border-r border-gray-800 shrink-0 h-full">
        <div className="px-5 py-6">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-[#0284c7] text-white w-9 h-9 flex items-center justify-center rounded-xl font-black shadow-lg shadow-[#0284c7]/20">
              B
            </div>
            <div>
              <h1 className="text-white font-extrabold leading-none text-base tracking-tight">BookNest</h1>
              <span className="text-[10px] text-[#38bdf8] font-black tracking-wider uppercase">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-350 text-sm font-semibold ${
                      isActive
                        ? "bg-[#e0f2fe] text-[#0369a1] shadow-sm font-bold scale-[1.02]"
                        : "hover:bg-gray-800/60 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & footer */}
        <div className="p-4 border-t border-gray-800/80 bg-gray-950/20">
          <div className="flex items-center gap-3 px-2 py-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 font-bold shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-white transition text-gray-300"
            >
              <Home className="w-3.5 h-3.5" />
              Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-red-950/30 hover:bg-red-900 hover:text-white text-red-400 transition border border-red-900/10 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">BookNest Admin</span>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-[10px] text-gray-700 font-black uppercase tracking-wider">Control Panel</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Calendar / Date widget */}
            <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-500 font-black bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </button>

            <div className="h-6 w-px bg-gray-200" />

            {/* Admin Profile Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284c7] font-black border border-sky-100 flex items-center justify-center text-xs shadow-sm">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
                <span className="text-[9px] text-[#0284c7] font-black uppercase tracking-wider mt-0.5 block">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
