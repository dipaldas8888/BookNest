import heroImage from "../assets/hero-book.jpg";

export default function Hero() {
  return (
    <section
      className="
      flex items-center 
      py-16  px-0 md:px-10         
                   
    "
    >
      <div
        className="
        max-w-7xl mx-auto
        grid grid-cols-1 lg:grid-cols-2
        gap-12 items-center
        text-center md:text-left   /* NEW: center text on small screens */
      "
      >
        <div>
          <h1
            className="
            text-5xl sm:text-5xl lg:text-7xl   /* NEW: responsive heading sizes */
            font-extrabold text-gray-900 leading-tight
          "
          >
            Discover Your Next <br />
            <span className="text-indigo-600">Favorite Book</span>
          </h1>

          <p
            className="
            mt-5 
            text-base sm:text-lg              /* NEW: small screen smaller font */
            text-gray-600 max-w-xl 
            mx-auto md:mx-0                  /* NEW: center paragraph only on mobile */
          "
          >
            Explore thousands of books across fiction, self-help, technology,
            business, and more.
          </p>

          <div
            className="
            mt-8 flex flex-wrap justify-center md:justify-start gap-4  /* NEW: center buttons on mobile */
          "
          >
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Browse Books
            </button>

            <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition">
              Best Sellers
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={heroImage}
            alt="Reading books"
            className="
            w-72 sm:w-96 md:w-full lg:w-[550px]
            px-2
            rounded-2xl shadow-xl 
            hover:scale-105 transition-transform duration-300
          "
          />
        </div>
      </div>
    </section>
  );
}
