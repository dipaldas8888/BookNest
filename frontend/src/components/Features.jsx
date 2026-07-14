import { Library, BadgePercent, Truck, Star, ShieldCheck, Clock } from "lucide-react";

const features = [
  { icon: Library, title: "Massive Library", desc: "10,000+ titles across fiction, tech, business, self-help & more.", color: "bg-emerald-50 text-emerald-700" },
  { icon: BadgePercent, title: "Great Deals", desc: "Save up to 50% with seasonal sales, coupons & bundle offers.", color: "bg-orange-50 text-orange-600" },
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders above $50. Delivered in 2-4 business days.", color: "bg-blue-50 text-blue-600" },
  { icon: Star, title: "Curated Picks", desc: "Editor-curated lists so you always find the right book for you.", color: "bg-purple-50 text-purple-600" },
  { icon: ShieldCheck, title: "Secure Payments", desc: "SSL-encrypted checkout with Razorpay, Google Pay & more.", color: "bg-green-50 text-green-700" },
  { icon: Clock, title: "Easy Returns", desc: "30-day hassle-free return policy on all physical books.", color: "bg-rose-50 text-rose-600" },
];

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="section-tag mb-2">WHY BOOK LOVERS CHOOSE US</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            Everything for the perfect reading experience
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="book-card p-6 group hover:shadow-lg transition-all">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#1a3a2a] transition">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
