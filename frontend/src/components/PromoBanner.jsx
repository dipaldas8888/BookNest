import { Link } from "react-router-dom";
import { Tag, ArrowRight, Zap, Gift } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-12 bg-[#f9f7f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Big sale banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a3a2a] p-8 flex items-end min-h-[200px] group">
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=70"
            alt="sale"
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute top-4 right-4 bg-[#e67e22] text-white font-black text-sm px-4 py-2 rounded-xl shadow-lg rotate-3">
            Up to 50% OFF
          </div>
          <div className="relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              <Tag className="w-3.5 h-3.5 inline mr-1" />
              Summer Sale
            </p>
            <h3 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-4">
              Bestsellers at<br />Unbeatable Prices
            </h3>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-[#1a3a2a] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Two smaller promo cards stacked */}
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 p-6 flex items-center gap-5 group min-h-[88px]">
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=70"
              alt="new arrivals"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-25 transition duration-500"
            />
            <div className="relative z-10 w-10 h-10 bg-white/25 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-white/80 text-xs font-semibold">JUST DROPPED</p>
              <h4 className="text-white font-black text-lg">New Arrivals This Week</h4>
            </div>
            <Link to="/products" className="relative z-10 shrink-0">
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 p-6 flex items-center gap-5 group min-h-[88px]">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=70"
              alt="gift"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-25 transition duration-500"
            />
            <div className="relative z-10 w-10 h-10 bg-white/25 rounded-xl flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-white/80 text-xs font-semibold">EXCLUSIVE OFFER</p>
              <h4 className="text-white font-black text-lg">Free Shipping on ₹500+</h4>
            </div>
            <Link to="/products" className="relative z-10 shrink-0">
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
