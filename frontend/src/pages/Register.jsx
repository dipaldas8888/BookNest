import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/features/authSlice";

const Register = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg mx-auto overflow-hidden max-w-sm lg:max-w-4xl">
        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&w=667&q=80"
            alt="book"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full p-7 lg:w-1/2">
          <h1 className="text-2xl text-center text-gray-700 font-bold">
            BookNest
          </h1>

          <p className="text-center text-gray-600">Welcome!</p>

          <button
            type="button"
            className="flex items-center justify-center mt-4 w-full rounded-lg shadow-md hover:bg-gray-100"
          >
            <div className="px-4 py-3">
              <svg className="h-6 w-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107"
                />
              </svg>
            </div>

            <span className="px-4 py-3 text-gray-600 font-bold">
              Sign in with Google
            </span>
          </button>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5"></span>

            <span className="text-xs text-gray-500 uppercase">
              or login with email
            </span>

            <span className="border-b w-1/5"></span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>

              <input
                type="text"
                name="username"
                onChange={handleChange}
                required
                className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
                className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5"></span>

            <span className="text-xs text-gray-500 font-bold uppercase">
              or sign in
            </span>

            <span className="border-b w-1/5"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
