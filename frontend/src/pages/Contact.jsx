import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const infoCards = [
  { icon: MapPin, label: "Store Address", value: "123 Book St, Knowledge City", color: "bg-emerald-50 text-emerald-700" },
  { icon: Mail, label: "Email Support", value: "support@booknest.dev", color: "bg-blue-50 text-blue-700" },
  { icon: Phone, label: "Call Us", value: "+1 (800) 555-NEST", color: "bg-orange-50 text-orange-600" },
  { icon: Clock, label: "Store Hours", value: "9:00 AM – 8:00 PM", color: "bg-purple-50 text-purple-700" },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-[#f9f7f4] min-h-screen">

      {/* Hero Banner */}
      <div className="relative bg-[#1a3a2a] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=60"
          alt="library"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full">
              Contact Us
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              Get in Touch with<br />Our Bookstore Team
            </h1>
          </div>
          <p className="text-white/65 text-sm leading-relaxed max-w-sm text-center md:text-right">
            Have questions about book orders, availability, or need reading recommendations?
            Our BookNest crew is ready to help you navigate our virtual shelves.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {infoCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition">
              <div className={`p-3 rounded-xl border ${color} border-current/10 shrink-0`} style={{ borderColor: "transparent" }}>
                <div className={`p-2.5 rounded-xl ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-sm font-bold text-gray-900">{value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            
            {/* Image side */}
            <div className="relative min-h-[360px] md:min-h-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80"
                alt="bookshelf"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1a3a2a]/70" />
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <h3 className="text-white font-black text-2xl mb-2">We'd love to hear from you</h3>
                <p className="text-white/65 text-sm leading-relaxed">
                  Whether it's a question, feedback, or a book recommendation request — drop us a line.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "📧 support@booknest.dev",
                    "📞 +1 (800) 555-NEST",
                    "⏰ Mon – Sat: 9AM – 8PM",
                  ].map((item) => (
                    <p key={item} className="text-white/70 text-sm font-medium">{item}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Form side */}
            <div className="p-8 sm:p-10">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 py-10 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Send a Message</h2>
                    <p className="text-sm text-gray-500">Fill in the form below and we'll respond promptly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                      <input
                        type="text" required placeholder="John"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/20 focus:border-[#1a3a2a] transition bg-white text-gray-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text" required placeholder="Doe"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/20 focus:border-[#1a3a2a] transition bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email" required placeholder="john@example.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/20 focus:border-[#1a3a2a] transition bg-white text-gray-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel" placeholder="+91 98765 43210"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/20 focus:border-[#1a3a2a] transition bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                    <textarea
                      required rows={4}
                      placeholder="Ask about books, orders, or recommendations..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/20 focus:border-[#1a3a2a] transition bg-white text-gray-900 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <input
                      type="checkbox" required id="terms"
                      className="w-4 h-4 rounded border-gray-300 text-[#1a3a2a] focus:ring-[#1a3a2a] cursor-pointer accent-[#1a3a2a]"
                    />
                    <label htmlFor="terms" className="cursor-pointer">
                      I agree to the <span className="font-semibold text-[#1a3a2a]">Terms &amp; Privacy Policy</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white font-bold py-4 rounded-xl text-sm transition cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map placeholder / Bottom banner */}
        <div className="relative bg-[#1a3a2a] rounded-2xl p-8 overflow-hidden text-center">
          <img
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=50"
            alt="study"
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
          <div className="relative z-10 max-w-lg mx-auto">
            <p className="text-[#e67e22] text-xs font-black uppercase tracking-widest mb-3">📍 Visit Us</p>
            <h3 className="text-white font-black text-xl sm:text-2xl mb-2">123 Book Street, Knowledge City</h3>
            <p className="text-white/60 text-sm">Open Monday to Saturday · 9:00 AM – 8:00 PM</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
