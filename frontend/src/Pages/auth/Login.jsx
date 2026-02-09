import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data.data;

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Role navigation
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
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
              Welcome back to{" "}
              <em className="text-outline">Your Farming Journey.</em>
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
                  alt="login-page-icon"
                />
              </div>

              {/* Quote */}
              <h1 className="relative z-10 text-lg md:text-xl font-semibold text-white leading-relaxed">
                "Access your tools and connections,
                <span className="text-[#03a74f]"> continue growing.</span>"
              </h1>

              {/* Divider */}
              <div className="relative z-10 w-12 h-[3px] bg-[#03a74f] mx-auto my-4 rounded-full"></div>

              {/* Sub text */}
              <p className="relative z-10 text-sm text-gray-300">
                Your farming community awaits you.
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
            <h1 className="text-[32px] font-bold">Welcome Back 👋</h1>
            <p className="text-[#5E5E5E] dark:text-gray-700">
              Login to your AgriRent account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* INPUTS */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              required
              onChange={handleChange}
              className="w-full rounded-lg border-gray-400 
pl-4 py-3 
 placeholder-gray-400 border-[1.5px]
focus:border-[#03a74f] focus:ring-[#1f3d2b] bg-white outline-none"
            />

            {/* Password Input with Eye Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-400 
pl-4 py-3 pr-12 bg-white 
 placeholder-gray-400 border-[1.5px]
focus:border-[#03a74f] focus:ring-[#1f3d2b] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold bg-[#03a74f] hover:bg-[#028a42] cursor-pointer transition-transform active:scale-95 hover:-translate-y-2 duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#03a74f] font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
