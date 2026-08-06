import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      alert(res.data.message);

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        <div className="login-box">
          <h2>Forgot Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;