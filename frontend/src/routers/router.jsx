import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import About from "../pages/About";
import Contact from "../pages/Contact";
import OAuthSuccess from "../pages/OAuthSuccess";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import DashboardBooks from "../pages/Dashboard/DashboardBooks";
import DashboardOrders from "../pages/Dashboard/DashboardOrders";
import DashboardUsers from "../pages/Dashboard/DashboardUsers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },

      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },

      { path: "/products", element: <Products /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/oauth-success", element: <OAuthSuccess /> },

      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/dashboard",

    element: <DashboardLayout />,

    children: [
      { index: true, element: <DashboardHome /> },

      { path: "orders", element: <DashboardOrders /> },

      { path: "books", element: <DashboardBooks /> },

      { path: "users", element: <DashboardUsers /> },
    ],
  },
]);

export default router;
