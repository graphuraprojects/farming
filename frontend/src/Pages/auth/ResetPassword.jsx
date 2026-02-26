import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { color, gradientBg } from "../../theme";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`/api/auth/verify-reset-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        setStep(2);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`/api/auth/reset-password`, {
        email,
        newPassword,
      });

      if (res.data.success) {
        alert(
          "Password reset successfully! Please login with your new password.",
        );
        navigate("/login");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `${color.mintCream}cc` }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.08)", border: `1px solid ${color.border}` }}>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors duration-200"
            style={{ color: color.textSoft }}
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: color.paleGreen }}
            >
              <Lock className="w-7 h-7" style={{ color: color.emerald }} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: color.text }}>
              {step === 1 ? "Verify OTP" : "Create New Password"}
            </h1>
            <p className="text-sm" style={{ color: color.textSoft }}>
              {step === 1
                ? `We sent a 6-digit code to ${email}`
                : "Choose a strong password for your account"}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  required
                  className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-200 text-center text-2xl tracking-widest font-mono placeholder:text-gray-300"
                  style={{ border: `1.5px solid ${color.inputBorder}`, background: "white" }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  placeholder="000000"
                />
              </div>

              {message && (
                <div className="p-3 rounded-xl text-sm font-medium" style={{ background: "#fef2f2", color: color.danger, border: "1px solid #fecaca" }}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
                    style={{ border: `1.5px solid ${color.inputBorder}`, background: "white" }}
                    onFocus={(e) => e.target.style.borderColor = color.emerald}
                    onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: color.textSoft }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs mt-1.5" style={{ color: color.textSoft }}>
                  Must be at least 6 characters
                </p>
              </div>

              {message && (
                <div className="p-3 rounded-xl text-sm font-medium" style={{ background: "#fef2f2", color: color.danger, border: "1px solid #fecaca" }}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || newPassword.length < 6}
                className="w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
