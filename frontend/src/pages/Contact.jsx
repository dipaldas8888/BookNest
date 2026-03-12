import { Facebook, Twitter, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <div className=" min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="bg-white rounded-xl p-10 flex flex-col md:flex-row justify-between gap-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold leading-snug">
              <span className="bg-green-200 px-3 py-1 rounded">
                Get in Touch
              </span>
              <br />
              with Our Book Store
            </h1>
          </div>

          <div className="max-w-md text-gray-600 text-sm space-y-4">
            <p>
              Have questions about books, orders, or recommendations? Our
              bookstore team is here to help you find the perfect read. Feel
              free to contact us for book inquiries or support.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Store Address</p>
            <h3 className="font-medium">123 Book Street, Knowledge City</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Email Support</p>
            <h3 className="font-medium">support@bookstore.com</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Customer Service</p>
            <h3 className="font-medium">+91 98765 43210</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Store Hours</p>
            <h3 className="font-medium">9:00 AM – 8:00 PM</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-10 grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="rounded-xl overflow-hidden h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66"
              alt="books"
              className="h-full w-full object-cover"
            />
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <input
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <textarea
              placeholder="Ask about books, orders, or recommendations..."
              className="border border-gray-300 rounded-lg p-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-green-300"
            />

            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              <span>I agree to the Terms & Privacy Policy</span>
            </div>

            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
