import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { color, gradientBg } from "../../theme";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resendTimer, setResendTimer] = useState(0);

  const email = location.state?.email;
  const name = location.state?.name;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    console.log("📧 VerifyOtp Mounted with email:", email);
  }, []);
  useEffect(() => {
    let interval;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      return setMessage("Please enter OTP");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`/api/auth/verify-otp`, {
        email,
        otp,
      });
      setMessage(res.data.message);

      if (res.data.data?.token) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    console.log("🔥 Resend OTP clicked");
    console.log("📧 Email:", email);
    console.log("🌍 Current URL:", window.location.origin);
    console.log("📡 Calling: /api/auth/resend-otp");

    if (resendTimer > 0) return;

    try {
      setLoading(true);
      setMessage("");

      console.log("🚀 Sending request...");

      const res = await axios.post("/api/auth/resend-otp", { email });

      console.log("✅ Response:", res.data);

      setMessage(res.data.message);
      setResendTimer(30);
    } catch (err) {
      console.error("❌ Error:", err);
      console.error("❌ Error Response:", err.response);
      setMessage(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: color.bg }}
      >
        <div className="text-center">
          <p className="mb-4 font-medium" style={{ color: color.danger }}>
            Invalid access. Please register again.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: gradientBg(color.emerald, color.forest) }}
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full flex-row overflow-hidden"
      style={{ background: color.bg }}
    >
      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb")',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(165deg, ${color.deepForest}dd 0%, ${color.forest}bb 40%, rgba(0,0,0,0.5) 100%)`,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Almost there!{" "}
              <span style={{ color: color.lush }}>Verify Your Account.</span>
            </h1>
            <div
              className="mt-6 max-w-md w-full rounded-3xl overflow-hidden backdrop-blur-xl p-8 text-center"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex justify-center mb-3">
                <img
                  className="w-16"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1770029209/register-icon_nnebju.png"
                  alt="verify-otp-icon"
                />
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                "Secure your account,
                <span style={{ color: color.lush }}> start your journey."</span>
              </h2>

              <div
                className="w-12 h-[3px] mx-auto my-4 rounded-full"
                style={{ background: gradientBg(color.lush, color.emerald) }}
              />

              <p className="text-sm text-gray-300">
                We've sent a verification code to <strong>{email}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div
        className="flex flex-1 flex-col justify-center items-center p-6 overflow-y-auto"
        style={{ background: `${color.mintCream}cc` }}
      >
        <div className="w-full max-w-[480px] flex flex-col gap-5">
          <div>
            <h1
              className="text-[32px] font-extrabold tracking-tight"
              style={{ color: color.text }}
            >
              Verify Your Email
            </h1>
            <p style={{ color: color.textSoft }}>
              Enter the 6-digit OTP sent to{" "}
              <strong style={{ color: color.text }}>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full text-center tracking-widest text-xl font-mono rounded-xl py-3.5 outline-none transition-all duration-200 placeholder:text-gray-300"
              style={{
                border: `1.5px solid ${color.inputBorder}`,
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = color.emerald)}
              onBlur={(e) => (e.target.style.borderColor = color.inputBorder)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: gradientBg(color.emerald, color.forest),
                boxShadow: `0 4px 16px ${color.emerald}30`,
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendTimer > 0}
                className="text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: color.emerald }}
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Didn't receive code? Resend OTP"}
              </button>
            </div>
            {message && (
              <p
                className="text-center text-sm font-medium"
                style={{
                  color: message.includes("success")
                    ? color.emerald
                    : color.danger,
                }}
              >
                {message}
              </p>
            )}

            {/* <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm font-medium disabled:opacity-50"
                style={{ color: color.emerald }}
              >
                Didn't receive code? Resend OTP
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
