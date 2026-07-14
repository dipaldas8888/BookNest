import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Avid Reader",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "BookNest completely changed how I discover books. Found 3 life-changing reads in just one month!",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "The business books selection is incredible. Fast delivery and super easy checkout with Razorpay.",
    rating: 5,
  },
  {
    name: "Anjali Patel",
    role: "College Student",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "Great prices with amazing discounts. I've recommended BookNest to all my friends!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-[#f9f7f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="section-tag mb-2">WHAT READERS SAY</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Loved by Book Lovers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="book-card p-6 flex flex-col gap-4">
              <Quote className="w-8 h-8 text-[#1a3a2a]/20" />
              <p className="text-gray-700 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-[#e67e22] text-sm">★</span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
