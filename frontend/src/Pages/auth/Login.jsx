import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { color, gradientBg } from "../../theme";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "owner":
          navigate("/owner-dashboard");
          break;

        case "farmer":
        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err.response?.data?.message || "Login failed");
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden" style={{ background: color.bg }}>
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
              Welcome back to{" "}
              <span style={{ color: color.lush }}>Your Farming Journey.</span>
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
                  alt="login-page-icon"
                />
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                "Access your tools and connections,
                <span style={{ color: color.lush }}> continue growing."</span>
              </h2>

              <div className="w-12 h-[3px] mx-auto my-4 rounded-full" style={{ background: gradientBg(color.lush, color.emerald) }} />

              <p className="text-sm text-gray-300">
                Your farming community awaits you.
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
            <h1 className="text-[32px] font-extrabold tracking-tight" style={{ color: color.text }}>
              Welcome Back 👋
            </h1>
            <p style={{ color: color.textSoft }}>
              Login to your AgriRent account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              required
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
              style={{
                border: `1.5px solid ${color.inputBorder}`,
                background: "white",
              }}
              onFocus={(e) => e.target.style.borderColor = color.emerald}
              onBlur={(e) => e.target.style.borderColor = color.inputBorder}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3.5 pr-12 text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
                style={{
                  border: `1.5px solid ${color.inputBorder}`,
                  background: "white",
                }}
                onFocus={(e) => e.target.style.borderColor = color.emerald}
                onBlur={(e) => e.target.style.borderColor = color.inputBorder}
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold transition-colors duration-200"
                style={{ color: color.emerald }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="group w-full py-3.5 rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: gradientBg(color.emerald, color.forest),
                boxShadow: `0 4px 16px ${color.emerald}30`,
              }}
            >
              {loading ? "Logging in..." : (
                <>
                  Login
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: color.textSoft }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold" style={{ color: color.emerald }}>
              Register here
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-xs mt-6" style={{ color: color.textSoft }}>
          <Link to="/T&C" className="hover:opacity-70 transition-opacity">
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link to="/P" className="hover:opacity-70 transition-opacity">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
