import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { clearCart } from "../redux/features/cartSlice";
import { ShoppingBag, ArrowRight, ChevronRight, Shield, Truck, RefreshCw, CreditCard, Send } from "lucide-react";
import { toast } from "react-toastify";

const trustBadges = [
  { icon: Shield, label: "100% Secure", sub: "SSL Encrypted" },
  { icon: CreditCard, label: "Razorpay", sub: "Test Mode Active" },
  { icon: Truck, label: "Fast Delivery", sub: "2–4 Business Days" },
  { icon: RefreshCw, label: "Easy Returns", sub: "30-Day Policy" },
];

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="bg-[#f9f7f4] min-h-screen animate-fadeIn">
      {/* Promo announcement */}
      <div className="bg-[#1a3a2a] text-white text-center py-2.5 text-xs font-semibold">
        🎉 Use code <span className="font-black text-[#e67e22]">BOOKNEST20</span> for 20% off &nbsp;|&nbsp;
        <span className="font-black text-[#e67e22]">BOOK10</span> for 10% off
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
          <Link to="/" className="hover:text-gray-800 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-bold">Cart</span>
        </nav>

        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">YOUR CART</h1>
        <p className="text-gray-500 text-sm mb-8">
          {totalItems === 0 ? "Your cart is empty." : `${totalItems} item${totalItems !== 1 ? "s" : ""} ready for checkout`}
        </p>

        {cartItems.length === 0 ? (
          /* ── Empty State ── */
          <div className="text-center max-w-md mx-auto py-16">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 shadow-sm">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-8">
              Looks like you haven't added any books yet. Discover our collection of bestsellers!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white font-bold py-3.5 px-8 rounded-xl transition text-sm shadow-sm"
            >
              Browse Books <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* Items list */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}

              <div className="flex items-center justify-between pt-4">
                <Link to="/products" className="text-sm font-bold text-[#1a3a2a] hover:underline">
                  ← Continue Shopping
                </Link>
                <button
                  onClick={() => {
                    dispatch(clearCart());
                    toast.info("Cart cleared");
                  }}
                  className="text-xs font-bold text-red-400 hover:text-red-600 transition cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              {/* Trust badges row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-2 border-t border-gray-200">
                {trustBadges.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Icon className="w-5 h-5 text-[#1a3a2a]" />
                    <p className="text-[11px] font-black text-gray-800">{label}</p>
                    <p className="text-[10px] text-gray-500">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <CartSummary items={cartItems} />
          </div>
        )}

        {/* Bottom newsletter banner */}
        <div className="mt-16 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=60"
              alt="library"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1a3a2a]/85" />
          </div>
          <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white text-center sm:text-left">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Stay Updated</p>
              <h3 className="text-xl sm:text-2xl font-black leading-snug">
                STAY CONNECTED ABOUT OUR<br />LATEST OFFERS & NEW ARRIVALS
              </h3>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0 max-w-sm">
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 gap-2">
                <span className="text-white/40 text-sm shrink-0">✉</span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-transparent text-white placeholder-white/40 text-sm focus:outline-none flex-1 min-w-0"
                />
              </div>
              <button className="bg-[#e67e22] hover:bg-[#d35400] text-white font-black py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer">
                <Send className="w-4 h-4" /> Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
