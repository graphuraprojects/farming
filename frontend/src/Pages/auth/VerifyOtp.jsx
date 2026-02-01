import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // userId passed from register page
  const userId = location.state?.userId;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      return setMessage("Please enter OTP");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("/api/auth/verify-otp", {
        userId,
        otp,
      });

      setMessage(res.data.message);

      // Redirect to login after success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Invalid access. Please register again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Verify Your Email
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full text-center tracking-widest text-lg border border-gray-300 rounded-lg py-3 focus:outline-none focus:border-[#1f3d2b]"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-[#1f3d2b] text-white rounded-lg font-semibold hover:bg-green-900 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
