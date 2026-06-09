import "./App.css";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/features/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen max-w-screen-2xl  mx-auto  font-primary bg-gray">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
