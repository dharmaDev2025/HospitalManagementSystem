import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;

        case "doctor":
          navigate("/doctor/dashboard", { replace: true });
          break;

        case "labExpert":
          navigate("/lab/dashboard", { replace: true });
          break;

        default:
          navigate("/patient/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return <Login />;
}

export default Home;