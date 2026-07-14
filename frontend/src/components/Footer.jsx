import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Send, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1a3a2a] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-black text-xl">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              BookNest
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Discover thousands of books across fiction, tech, business and self-help. Your next favorite read is waiting.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition">
                  <Icon className="w-4 h-4 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Navigation</h3>
            <ul className="space-y-3 text-sm">
              {[["Home", "/"], ["Shop", "/products"], ["About", "/about"], ["Contact", "/contact"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-white/70 hover:text-white transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Help</h3>
            <ul className="space-y-3 text-sm">
              {["FAQ", "Shipping Info", "Returns & Refunds", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Newsletter</h3>
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              Get weekly book recommendations and exclusive deals.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="flex items-center bg-white/10 border border-white/15 rounded-xl overflow-hidden">
                <input
                  type="email" placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 text-sm text-white placeholder-white/40 bg-transparent focus:outline-none"
                  required
                />
                <button type="submit"
                  className="bg-[#e67e22] hover:bg-[#d35400] text-white p-2.5 transition shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40">
          <p>© {new Date().getFullYear()} BookNest. All rights reserved.</p>
          <div className="flex gap-5 mt-3 sm:mt-0">
            <a href="#" className="hover:text-white/70 transition">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
