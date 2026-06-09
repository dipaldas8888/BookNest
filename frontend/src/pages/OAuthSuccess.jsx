import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../redux/features/authSlice";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then((res) => {
        const user = res.User;
        if (user && user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("OAuth session verification failed:", error);
        navigate("/login");
      });
  }, [dispatch, navigate]);

  return <h2 className="text-center mt-20">Logging you in securely...</h2>;
};

export default OAuthSuccess;
