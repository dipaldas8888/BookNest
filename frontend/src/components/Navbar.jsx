import { useState } from "react";
import { BaggageClaim, Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";
import logo from "../assets/BookNest.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <div className="py-6 px-4">
      <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white px-6 py-3 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="bg-purple-500 text-white w-8 h-8 flex items-center justify-center rounded-md">
            <img src={logo} className="w-8 h-8" alt="logo" />
          </div>
          <Link to="/">BookNest</Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-gray-600 font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100"
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
                `px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100"
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
                `px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100"
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
                `px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100"
                }`
              }
            >
              About
            </NavLink>
          </li>
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/cart">
            <BaggageClaim className="cursor-pointer" />
          </Link>

          {token ? (
            <>
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-9 h-9 rounded-full object-cover"
              />

              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white mt-3 rounded-xl shadow-lg p-6 space-y-4 max-w-6xl mx-auto">
          <NavLink
            to="/"
            className="block hover:text-purple-600"
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className="block hover:text-purple-600"
            onClick={() => setOpen(false)}
          >
            Products
          </NavLink>

          <NavLink
            to="/contact"
            className="block hover:text-purple-600"
            onClick={() => setOpen(false)}
          >
            Contact
          </NavLink>

          <NavLink
            to="/about"
            className="block hover:text-purple-600"
            onClick={() => setOpen(false)}
          >
            About
          </NavLink>

          <div className="flex items-center gap-6 pt-4 border-t">
            <Link to="/cart">
              <BaggageClaim />
            </Link>

            {token ? (
              <>
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover"
                />

                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-purple-600 font-medium"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
