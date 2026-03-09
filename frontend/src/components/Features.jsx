import Books from "../assets/Books.jpg";
import Sale from "../assets/BookSale.jpg";
import Delivery from "../assets/Delivery.jpg";

export default function Features() {
  return (
    <section className="py-2 bg-gray">
      <div className="max-w-7xl mx-auto px-1">
        <h1 className="text-3xl font-semibold text-center mx-auto">
          Why Readers Love Us
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
          Everything you need to read more, pay less, and find the perfect book.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 px-4 sm:px-1">
          <div className="hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl w-full h-60"
              src={Books}
              alt="Huge Collection"
            />
            <h3 className="text-base font-semibold text-slate-700 mt-4">
              📚 Massive Library
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Browse fiction, fantasy, tech, business, self-help & more.
            </p>
          </div>

          <div className="hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl w-full h-60"
              src={Sale}
              alt="Affordable Prices"
            />
            <h3 className="text-base font-semibold text-slate-700 mt-4">
              💸 Affordable Prices
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Save big with deals, discounts, and student-friendly pricing.
            </p>
          </div>

          <div className="hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl w-full h-60 object-cover object-top"
              src={Delivery}
              alt="Fast Delivery"
            />
            <h3 className="text-base font-semibold text-slate-700 mt-4">
              🚚 Fast Delivery
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Get your favorite books delivered quickly & safely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
