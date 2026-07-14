import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Settings, LogIn, UserPlus, BookOpen, Heart } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import logo from "../assets/BookNest.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#1a3a2a] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tight shrink-0">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center border border-white/20 overflow-hidden">
            <img src={logo} className="w-5 h-5 object-contain" alt="BookNest" />
          </div>
          <span className="hidden sm:inline">BookNest</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#e67e22] text-white text-[9px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/50 bg-white/10 transition cursor-pointer"
              aria-label="Account menu"
            >
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50 text-sm">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1 space-y-0.5">
                      {user.role === "admin" && (
                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition">
                          <LayoutDashboard className="w-4 h-4 text-[#1a3a2a]" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition">
                        <Settings className="w-4 h-4 text-[#1a3a2a]" />
                        My Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition text-left cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-1 space-y-0.5">
                    <Link to="/login" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition">
                      <LogIn className="w-4 h-4 text-[#1a3a2a]" />
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition">
                      <UserPlus className="w-4 h-4 text-[#1a3a2a]" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a3a2a] border-t border-white/10 px-4 pb-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {user && (
            <div className="pt-3 mt-2 border-t border-white/10 space-y-1">
              {user.role === "admin" && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 text-sm font-semibold transition">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 text-sm font-semibold transition">
                My Profile
              </Link>
              <button onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/20 text-sm font-semibold transition cursor-pointer">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
