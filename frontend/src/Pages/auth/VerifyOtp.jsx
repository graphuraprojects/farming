import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from register page instead of userId
  const email = location.state?.email;
  const name = location.state?.name;

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
        email,  // ✅ Send email instead of userId
        otp,
      });

      setMessage(res.data.message);

      // ✅ Store token and user from response (auto-login after verification)
      if (res.data.data?.token) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }

      // Redirect to home/dashboard after success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("/api/auth/resend-otp", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Invalid access. Please register again.</p>
          <button 
            onClick={() => navigate("/register")}
            className="px-6 py-2 bg-[#03a74f] text-white rounded-lg hover:bg-[#028a42]"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden bg-[#FAFAF7] dark:bg-[#161c18]">
      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1f3d2b]">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-white text-2xl md:text-3xl lg:text-5xl font-bold">
              Almost there!{" "}
              <em className="text-outline">Verify Your Account.</em>
            </h1>
            <div className="mt-5 max-w-md w-full rounded-3xl overflow-hidden bg-black/60 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.55)] p-8 text-center relative">
              <div className="flex justify-center mb-3 relative z-10">
                <img
                  className="w-16"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1770029209/register-icon_nnebju.png"
                  alt="verify-otp-icon"
                />
              </div>

              <h1 className="relative z-10 text-lg md:text-xl font-semibold text-white leading-relaxed">
                "Secure your account,
                <span className="text-[#03a74f]"> start your journey.</span>"
              </h1>

              <div className="relative z-10 w-12 h-[3px] bg-[#03a74f] mx-auto my-4 rounded-full"></div>

              <p className="relative z-10 text-sm text-gray-300">
                We've sent a verification code to <strong>{email}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex flex-1 flex-col justify-center items-center p-2 overflow-y-auto bg-[#e9fbf1cc]">
        <div className="w-full max-w-[480px] flex flex-col gap-4">
          {/* Header */}
          <div>
            <h1 className="text-[32px] font-bold">
              Verify Your Email
            </h1>
            <p className="text-[#5E5E5E] dark:text-gray-700">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* OTP INPUT */}
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full text-center tracking-widest text-lg rounded-lg border-gray-400 
py-3 bg-white 
placeholder-gray-400 border-[1.5px]
focus:border-[#03a74f] focus:ring-[#1f3d2b] outline-none"
            />

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold bg-[#03a74f] hover:bg-[#028a42] cursor-pointer transition-transform active:scale-95 hover:-translate-y-2 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Message */}
            {message && (
              <p className={`text-center text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}

            {/* Resend OTP */}
            {/* <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-[#03a74f] hover:text-[#028a42] font-medium text-sm disabled:opacity-50"
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