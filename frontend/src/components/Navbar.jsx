import { useState, useRef, useEffect } from "react";
import { BaggageClaim, Menu, X, User, LogOut, LayoutDashboard, Settings, LogIn, UserPlus } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import logo from "../assets/BookNest.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate total items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-4 px-4 bg-gray-50/50 sticky top-0 z-50 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border border-gray-100 shadow-md">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl text-gray-900 tracking-tight hover:opacity-90 transition">
          <div className="bg-purple-600 text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-md overflow-hidden">
            <img src={logo} className="w-6 h-6 object-contain" alt="logo" />
          </div>
          <span>BookNest</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-650">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-purple-50 text-purple-600 font-bold"
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-purple-50 text-purple-600 font-bold"
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Products
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-purple-50 text-purple-600 font-bold"
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Contact
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-purple-50 text-purple-600 font-bold"
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                }`
              }
            >
              About
            </NavLink>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Cart Link with Badge */}
          <Link 
            to="/cart" 
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-xl relative transition"
          >
            <BaggageClaim className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-purple-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Permanent Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-purple-500 bg-gray-100 transition shadow-sm cursor-pointer"
            >
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.name || "profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4.5 h-4.5 text-gray-550" />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50 text-sm">
                {user ? (
                  <>
                    {/* User profile header */}
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="font-bold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {user.role === "admin" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-650 hover:bg-purple-50 hover:text-purple-700 font-semibold transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-600" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-650 hover:bg-purple-50 hover:text-purple-700 font-semibold transition"
                      >
                        <Settings className="w-4 h-4 text-purple-600" />
                        My Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-650 hover:bg-red-50 hover:text-red-700 font-semibold transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-1 space-y-0.5">
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-650 hover:bg-purple-50 hover:text-purple-700 font-semibold transition"
                    >
                      <LogIn className="w-4 h-4 text-purple-600" />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-650 hover:bg-purple-50 hover:text-purple-700 font-semibold transition"
                    >
                      <UserPlus className="w-4 h-4 text-purple-600" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white mt-3 rounded-2xl border border-gray-100 shadow-lg p-5 space-y-4 max-w-6xl mx-auto text-sm font-semibold">
          <NavLink
            to="/"
            className="block px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-650 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className="block px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-650 transition"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>

          <NavLink
            to="/contact"
            className="block px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-650 transition"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>

          <NavLink
            to="/about"
            className="block px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-650 transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>

          {user && (
            <div className="pt-3 border-t border-gray-100 space-y-1">
              {user.role === "admin" && (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-purple-700 hover:bg-purple-50 transition"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-purple-50 transition"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
