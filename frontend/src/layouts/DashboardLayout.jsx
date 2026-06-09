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
  User as UserIcon
} from "lucide-react";
import { logoutUser } from "../redux/features/authSlice";

const DashboardLayout = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col justify-between border-r border-zinc-800">
        <div className="px-6 py-6">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-purple-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-bold shadow-md shadow-purple-600/30">
              B
            </div>
            <div>
              <h1 className="text-white font-bold leading-none text-base">BookNest</h1>
              <span className="text-xs text-purple-400 font-semibold tracking-wider uppercase">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? "bg-purple-600/10 text-purple-400 border border-purple-600/20"
                        : "hover:bg-zinc-900/50 hover:text-white border border-transparent"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 font-semibold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 hover:text-white transition duration-200 text-zinc-400"
            >
              <Home className="w-3.5 h-3.5" />
              Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-600/10 hover:bg-red-650 hover:text-white text-red-400 transition duration-200 border border-red-550/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
