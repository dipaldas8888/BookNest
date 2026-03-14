import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthFromToken } from "../redux/features/authSlice";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    console.log("token", token);

    if (token) {
      localStorage.setItem("token", token);

      dispatch(setAuthFromToken(token));

      navigate("/home");
    } else {
      navigate("/login");
    }
  }, []);

  return <h2 className="text-center mt-20">Logging you in...</h2>;
};

export default OAuthSuccess;
