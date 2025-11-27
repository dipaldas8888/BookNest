import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen max-w-screen-2xl  mx-auto px-4 py-4 font-primary">
        <Outlet />
      </div>
      <footer>footer</footer>
    </>
  );
}

export default App;
