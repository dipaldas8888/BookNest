import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray mt-20 border-t">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📚 BookNest</h2>

            <p className="text-gray-600 text-sm mt-4 leading-relaxed max-w-sm">
              Discover thousands of books across fiction, tech, business and
              self-help. Read more, learn more, and explore the world through
              books.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Important Links
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer transition">
                Home
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Trending
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Categories
              </li>
              <li className="hover:text-black cursor-pointer transition">
                About
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Follow Us
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer transition">
                Twitter
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Instagram
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Youtube
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Linkedin
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subscribe
            </h3>

            <p className="text-gray-600 text-sm mb-4">
              Get updates about new books and exclusive offers.
            </p>

            <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 text-sm outline-none"
              />

              <button className="bg-yellow-400 hover:bg-yellow-500 px-0 text-sm font-medium transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2025 BookVerse. All rights reserved.</p>

          <div className="flex items-center gap-6 mt-3 md:mt-0">
            <span className="hover:text-black cursor-pointer transition">
              Terms & Conditions
            </span>
            <span className="hover:text-black cursor-pointer transition">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
