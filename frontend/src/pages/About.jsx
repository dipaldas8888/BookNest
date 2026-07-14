import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Sparkles, Compass, Heart, Award, ShieldCheck,
  Users, Globe, Leaf, ArrowRight
} from "lucide-react";

const coreValues = [
  {
    icon: BookOpen,
    title: "Wide Collection",
    description: "Explore 10,000+ titles spanning fiction, technology, business, science, and much more.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    icon: Sparkles,
    title: "Beautiful Experience",
    description: "A clean, modern browsing experience designed specifically for book lovers like you.",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    icon: Compass,
    title: "Easy Discovery",
    description: "Find books instantly with smart categories, advanced filters, and lightning-fast search.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    icon: Heart,
    title: "Community & Passion",
    description: "Built by readers, for readers. Every title is carefully curated with love and care.",
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    icon: Award,
    title: "Secure Checkout",
    description: "Buy with confidence — 256-bit SSL encryption and Razorpay-protected payments.",
    color: "bg-purple-50 text-purple-700 border-purple-100",
  },
  {
    icon: ShieldCheck,
    title: "Fast Delivery",
    description: "Get your next great read delivered swiftly and safely right to your doorstep.",
    color: "bg-teal-50 text-teal-700 border-teal-100",
  },
];

const teamStats = [
  { icon: BookOpen, value: "10,000+", label: "Books" },
  { icon: Users, value: "25K+", label: "Readers" },
  { icon: Globe, value: "50+", label: "Countries" },
  { icon: Leaf, value: "5 Yrs", label: "Experience" },
];

export default function About() {
  return (
    <div className="bg-[#f9f7f4] min-h-screen">
      
      {/* Hero Banner */}
      <div className="relative bg-[#1a3a2a] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=70"
          alt="library"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center space-y-5">
          <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full">
            About BookNest
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Our Story &amp; Mission
          </h1>
          <p className="text-white/65 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Discover a world of stories, knowledge, and imagination. BookNest brings together
            thousands of titles across diverse genres to inspire, educate, and empower readers everywhere.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {teamStats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="space-y-1">
              <Icon className="w-6 h-6 text-[#1a3a2a] mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">

        {/* Core Values Grid */}
        <div>
          <div className="text-center mb-10">
            <p className="section-tag mb-2">WHY CHOOSE US</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">What makes BookNest special</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                >
                  <div className={`inline-flex p-3 rounded-xl border ${v.color} w-fit`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base mb-1.5">{v.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden h-72 md:h-96 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80"
              alt="bookstore"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <p className="section-tag">OUR STORY</p>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">
              We started with a single bookshelf.<br />Now we have millions of stories.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              BookNest was founded by a group of passionate readers who believed that great books 
              should be accessible to everyone. From a small collection of handpicked titles, 
              we've grown into a platform trusted by over 25,000 readers worldwide.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Our mission is simple: connect the right book with the right reader, every time.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white font-bold text-sm px-6 py-3 rounded-xl transition"
            >
              Explore Our Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quote Banner */}
        <div className="relative bg-[#1a3a2a] rounded-3xl p-10 text-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=50"
            alt="books"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
          <div className="relative z-10 max-w-xl mx-auto">
            <p className="text-[#e67e22] text-xs font-black uppercase tracking-widest mb-4">Our Vision</p>
            <blockquote className="text-white font-black text-xl sm:text-2xl leading-snug mb-4">
              "A room without books is like a body without a soul."
            </blockquote>
            <p className="text-white/50 text-sm font-semibold">— Marcus Tullius Cicero</p>
          </div>
        </div>

      </div>
    </div>
  );
}
