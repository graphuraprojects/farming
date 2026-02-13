import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, Tractor } from "lucide-react";

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

  // =====================
  // INPUT CHANGE LOG
  // =====================
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

  // =====================
  // SUBMIT LOG
  // =====================
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

      // ✅ Remove the userId extraction - just use form.email directly
      navigate("/verify-otp", {
        state: {
          email: form.email, // Use form data, not response data
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
              Join the community that{" "}
              <em className="text-outline">Powers the Harvest.</em>
            </h1>
            <div className="mt-5 max-w-md w-full rounded-3xl overflow-hidden bg-black/60 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.55)] p-8 text-center relative">
              <div className="flex justify-center mb-3 relative z-10">
                <img
                  className="w-16"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1770029209/register-icon_nnebju.png"
                  alt="register-page-icon"
                />
              </div>

              <h1 className="relative z-10 text-lg md:text-xl font-semibold text-white leading-relaxed">
                "Empowering farmers with the right machines,
                <span className="text-[#03a74f]"> at the right time.</span>"
              </h1>

              <div className="relative z-10 w-12 h-[3px] bg-[#03a74f] mx-auto my-4 rounded-full"></div>

              <p className="relative z-10 text-sm text-gray-300">
                Join our community and grow smarter with trusted tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex flex-1 flex-col justify-center items-center p-2 overflow-y-auto bg-[#e9fbf1cc]">
        <div className="w-full max-w-[480px] flex flex-col gap-4">
          <div>
            <h1 className="text-[32px] font-bold">Create Your Account</h1>
            <p className="text-[#5E5E5E] dark:text-gray-700">
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
                <div className="px-4 py-2 rounded-xl border-2 border-gray-200 bg-white peer-checked:border-[#03a74f] peer-checked:bg-green-50 flex flex-col items-start">
                  <Leaf size={40} className=" bg-gray-200 p-2 rounded-lg" />
                  <span className="font-bold">I am a Farmer</span>
                  <span className="text-xs text-gray-600">
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
                <div className="px-4 py-2 rounded-xl border-2 border-gray-200 bg-white peer-checked:border-[#03a74f] peer-checked:bg-green-50 flex flex-col items-start">
                  <Tractor size={40} className="bg-gray-200 p-2 rounded-lg" />
                  <span className="font-bold">I am an Owner</span>
                  <span className="text-xs text-gray-600">
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
              className="w-full rounded-lg border-gray-400 pl-4 py-3 placeholder-gray-400 border-[1.5px] focus:border-[#03a74f] focus:ring-[#1f3d2b] bg-white outline-none"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-400 pl-4 py-3 bg-white placeholder-gray-400 border-[1.5px] focus:border-[#03a74f] focus:ring-[#1f3d2b] outline-none"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              required
              onChange={handleChange}
              className="w-full rounded-lg border-gray-400 pl-4 py-3 bg-white placeholder-gray-400 border-[1.5px] focus:border-[#03a74f] focus:ring-[#1f3d2b] outline-none"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                required
                onChange={handleChange}
                className="w-full rounded-lg border-gray-400 pl-4 py-3 bg-white placeholder-gray-400 border-[1.5px] focus:border-[#03a74f] focus:ring-[#1f3d2b] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  console.log("Toggle Password Visibility");
                  setShowPassword(!showPassword);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Updated Terms & Conditions Checkbox */}
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="accent-[#03a74f] mt-1 flex-shrink-0"
              />
              <span className="text-gray-700">
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-[#03a74f] font-semibold hover:underline"
                  target="_blank"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="text-[#03a74f] font-semibold hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {message && (
              <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">
                {message}
              </p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold bg-[#03a74f] hover:bg-[#028a42] cursor-pointer transition-transform active:scale-95 hover:-translate-y-2 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 space-y-2">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#03a74f] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>

          {/* Additional Links */}
          <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
            <Link to="/T&C" className="hover:text-[#03a74f] transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/P" className="hover:text-[#03a74f] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
