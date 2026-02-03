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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <p className="text-red-500">Invalid access. Please register again.</p>
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
            <div
              className="mt-5
    max-w-md w-full
    rounded-3xl
    overflow-hidden
    bg-black/60
    border border-white/20
    shadow-[0_25px_60px_rgba(0,0,0,0.55)]
    p-8
    text-center
    relative
  "
            >
              {/* Icon */}
              <div className="flex justify-center mb-3 relative z-10">
                <img
                  className="w-16"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1770029209/register-icon_nnebju.png"
                  alt="verify-otp-icon"
                />
              </div>

              {/* Quote */}
              <h1 className="relative z-10 text-lg md:text-xl font-semibold text-white leading-relaxed">
                "Secure your account,
                <span className="text-[#03a74f]"> start your journey.</span>"
              </h1>

              {/* Divider */}
              <div className="relative z-10 w-12 h-[3px] bg-[#03a74f] mx-auto my-4 rounded-full"></div>

              {/* Sub text */}
              <p className="relative z-10 text-sm text-gray-300">
                We've sent a verification code to your email.
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
              Enter the 6-digit OTP sent to your email
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* OTP INPUT */}
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full text-center tracking-widest text-lg rounded-lg border-gray-400 
py-3 bg-white 
placeholder-gray-400 border-[1.5px]
focus:border-[#03a74f] focus:ring-[#1f3d2b] outline-none"
            />

            {/* VERIFY BUTTON */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold bg-[#03a74f] hover:bg-[#028a42] cursor-pointer transition-transform active:scale-95 hover:-translate-y-2 duration-300"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Message */}
            {message && (
              <p className="text-center text-sm text-gray-700">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;