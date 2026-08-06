import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(res.data.message);

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        <div className="login-box">
          <h2>Verify OTP</h2>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button type="submit">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default VerifyOtp;