import { BaggageClaim } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/BookNest.png";

const Navbar = () => {
  return (
    <div className="bg-gray-100 py-6">
      <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white px-6 py-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="bg-purple-500 text-white w-8 h-8 flex items-center justify-center rounded-md">
            <img src={logo} className="w-8 h-8 " />
          </div>
          <Link to="/">BookNest</Link>
        </div>

        <ul className="flex gap-6 text-gray-600 font-medium">
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
              Product
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

        <div className="flex items-center gap-6">
          <Link to="/cart">
            <BaggageClaim />
          </Link>

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
