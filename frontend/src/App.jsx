import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen max-w-screen-2xl  mx-auto  font-primary bg-gray-100">
        <Outlet />
      </div>
      <footer>footer</footer>
    </>
  );
}

export default App;
