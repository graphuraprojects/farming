import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, Tractor, ArrowRight } from "lucide-react";
import { color, gradientBg } from "../../theme";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "farmer",
    terms: false,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updatedValue = type === "checkbox" ? checked : value;

    console.log("Input Changed:", name, "=", updatedValue);

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: updatedValue };
      console.log("Updated Form State:", updatedForm);
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.terms) {
      return setMessage("Please accept terms & conditions");
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      };

      const res = await axios.post(`/api/auth/register`, payload);

      navigate("/verify-otp", {
        state: {
          email: form.email,
          name: form.name,
        },
      });
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    border: `1.5px solid ${color.inputBorder}`,
    background: "white",
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
              Join the community that{" "}
              <span style={{ color: color.lush }}>Powers the Harvest.</span>
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
                  alt="register-page-icon"
                />
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                "Empowering farmers with the right machines,
                <span style={{ color: color.lush }}> at the right time."</span>
              </h2>

              <div className="w-12 h-[3px] mx-auto my-4 rounded-full" style={{ background: gradientBg(color.lush, color.emerald) }} />

              <p className="text-sm text-gray-300">
                Join our community and grow smarter with trusted tools.
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
        <div className="w-full max-w-[480px] flex flex-col gap-4">
          <div>
            <h1 className="text-[32px] font-extrabold tracking-tight" style={{ color: color.text }}>
              Create Your Account
            </h1>
            <p style={{ color: color.textSoft }}>
              Select your role to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* ROLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={form.role === "farmer"}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <div
                  className="px-4 py-3 rounded-2xl border-2 bg-white peer-checked:bg-[#f0faf4] flex flex-col items-start gap-1 transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: form.role === "farmer" ? color.emerald : color.inputBorder }}
                >
                  <div
                    className="p-2 rounded-xl mb-1"
                    style={{ background: form.role === "farmer" ? color.paleGreen : "#f3f4f6" }}
                  >
                    <Leaf size={24} style={{ color: form.role === "farmer" ? color.emerald : color.textSoft }} />
                  </div>
                  <span className="font-bold text-sm" style={{ color: color.text }}>I am a Farmer</span>
                  <span className="text-xs" style={{ color: color.textSoft }}>
                    Rent machinery for your season needs.
                  </span>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={form.role === "owner"}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <div
                  className="px-4 py-3 rounded-2xl border-2 bg-white peer-checked:bg-[#f0faf4] flex flex-col items-start gap-1 transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: form.role === "owner" ? color.emerald : color.inputBorder }}
                >
                  <div
                    className="p-2 rounded-xl mb-1"
                    style={{ background: form.role === "owner" ? color.paleGreen : "#f3f4f6" }}
                  >
                    <Tractor size={24} style={{ color: form.role === "owner" ? color.emerald : color.textSoft }} />
                  </div>
                  <span className="font-bold text-sm" style={{ color: color.text }}>I am an Owner</span>
                  <span className="text-xs" style={{ color: color.textSoft }}>
                    List your machinery and earn rental income.
                  </span>
                </div>
              </label>
            </div>

            {/* INPUTS */}
            <input
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = color.emerald}
              onBlur={(e) => e.target.style.borderColor = color.inputBorder}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = color.emerald}
              onBlur={(e) => e.target.style.borderColor = color.inputBorder}
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              required
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = color.emerald}
              onBlur={(e) => e.target.style.borderColor = color.inputBorder}
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                required
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3.5 pr-12 text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = color.emerald}
                onBlur={(e) => e.target.style.borderColor = color.inputBorder}
              />
              <button
                type="button"
                onClick={() => {
                  console.log("Toggle Password Visibility");
                  setShowPassword(!showPassword);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: color.textSoft }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="mt-0.5 flex-shrink-0 w-4 h-4 rounded"
                style={{ accentColor: color.emerald }}
              />
              <span style={{ color: color.textSoft }}>
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="font-semibold hover:underline"
                  style={{ color: color.emerald }}
                  target="_blank"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="font-semibold hover:underline"
                  style={{ color: color.emerald }}
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {message && (
              <p className="text-sm text-center py-2.5 rounded-xl font-medium" style={{ color: color.danger, background: "#fef2f2" }}>
                {message}
              </p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="group w-full py-3.5 rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: gradientBg(color.emerald, color.forest),
                boxShadow: `0 4px 16px ${color.emerald}30`,
              }}
            >
              {loading ? "Creating..." : (
                <>
                  Create Account
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-5 space-y-2 text-sm" style={{ color: color.textSoft }}>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: color.emerald }}
            >
              Login here
            </Link>
          </p>
          <Link
            to="/admin/register"
            className="block font-semibold hover:underline"
            style={{ color: color.forest }}
          >
            Admin register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
