import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
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
