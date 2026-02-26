import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { color, gradientBg } from "../../theme";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`/api/auth/forgot-password`, { email });

      if (res.data.success) {
        navigate("/reset-password", { state: { email } });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

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
              <Mail className="w-7 h-7" style={{ color: color.emerald }} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: color.text }}>
              Forgot Password?
            </h1>
            <p className="text-sm" style={{ color: color.textSoft }}>
              Enter your email address and we'll send you an OTP to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
                style={{ border: `1.5px solid ${color.inputBorder}`, background: "white" }}
                onFocus={(e) => e.target.style.borderColor = color.emerald}
                onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                placeholder="Enter your email"
              />
            </div>

            {message && (
              <div className="p-3 rounded-xl text-sm font-medium" style={{ background: "#fef2f2", color: color.danger, border: "1px solid #fecaca" }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }}
            >
              {loading ? "Sending..." : "Send Reset OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
