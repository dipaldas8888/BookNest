import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/features/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="md:py-25">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="hidden lg:block lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&w=667&q=80"
            alt="book"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            BookNest
          </h2>

          <p className="text-xl text-gray-600 text-center">Welcome back!</p>

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

            <h1 className="px-4 py-3 text-gray-600 font-bold">
              Sign in with Google
            </h1>
          </button>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>

            <span className="text-xs text-gray-500 uppercase">
              or login with email
            </span>

            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>

                <a href="#" className="text-xs text-gray-500">
                  Forget Password?
                </a>
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>

            <Link
              to="/register"
              className="text-xs text-gray-500 font-bold uppercase"
            >
              or sign up
            </Link>

            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
