import { BookOpen, Users, Star, Truck } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "10,000+", label: "Books Available" },
  { icon: Users, value: "25,000+", label: "Happy Readers" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
  { icon: Truck, value: "2-4 Days", label: "Express Delivery" },
];

export default function StatsBar() {
  return (
    <section className="bg-[#1a3a2a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="space-y-1">
              <Icon className="w-6 h-6 text-[#e67e22] mx-auto mb-2" />
              <p className="text-white font-black text-2xl">{value}</p>
              <p className="text-white/60 text-xs font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
