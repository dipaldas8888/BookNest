export default function Example() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <h1 className="text-3xl font-semibold text-center mx-auto py-8">
        About Our Book Store
      </h1>

      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        Discover a world of stories, knowledge and imagination. Our bookstore
        brings together thousands of books across genres to inspire readers
        everywhere.
      </p>

      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 px-8 md:px-0 pt-16">
        <div className="size-[520px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-[#FBFFE1]"></div>

        <div>
          <div className="size-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/bookEmoji.png"
              alt=""
            />
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-base font-medium text-slate-600">
              Wide Collection of Books
            </h3>
            <p className="text-sm text-slate-500">
              Explore thousands of books from fiction, technology, business,
              science, and more.
            </p>
          </div>
        </div>

        <div>
          <div className="size-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png"
              alt=""
            />
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-base font-medium text-slate-600">
              Beautiful Reading Experience
            </h3>
            <p className="text-sm text-slate-500">
              Enjoy a clean and modern browsing experience designed for book
              lovers.
            </p>
          </div>
        </div>

        <div>
          <div className="size-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png"
              alt=""
            />
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-base font-medium text-slate-600">
              Easy Book Discovery
            </h3>
            <p className="text-sm text-slate-500">
              Find books quickly with smart categories, filters and search.
            </p>
          </div>
        </div>

        <div>
          <div className="size-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png"
              alt=""
            />
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-base font-medium text-slate-600">
              Fast & Secure Checkout
            </h3>
            <p className="text-sm text-slate-500">
              Buy your favorite books quickly with a safe and simple checkout
              process.
            </p>
          </div>
        </div>

        <div>
          <div className="size-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/boxEmoji.png"
              alt=""
            />
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-base font-medium text-slate-600">
              Fast Book Delivery
            </h3>
            <p className="text-sm text-slate-500">
              Get your favorite books delivered quickly to your doorstep.
            </p>
          </div>
        </div>

        <div>
          <div className="size-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/brainEmoji.png"
              alt=""
            />
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-base font-medium text-slate-600">
              Personalized Recommendations
            </h3>
            <p className="text-sm text-slate-500">
              Discover books tailored to your interests and reading habits.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
