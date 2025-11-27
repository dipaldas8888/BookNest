import React from "react";
import logo from "../assets/BookNest.png";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="max-w-screen px-10 py-6 bg-white shadow-md">
      <nav className="flex justify-between itesm-center bg-white ">
        <div className="flex items-center gap-3 md:pl-20 lg:pl-30">
          <Link to="/">
            <img src={logo} className="w-8 h-8 " />
          </Link>

          <div className="relative px-5">
            <input
              type="text"
              placeholder="Search.."
              className="lg:md:w-80 sm:w-18 h-8 pl-2 border border-gray-500 rounded-full gap-6 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <span className="absolute right-8 top-2">
              <FiSearch size={20} />
            </span>
          </div>
        </div>
        <div></div>
      </nav>
    </header>
  );
}

export default Navbar;
