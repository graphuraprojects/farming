import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.terms) {
      return setMessage("Please accept Terms & Conditions");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("/api/auth/register", {
        name: form.name,
        email: form.email, // ✅ REQUIRED
        password: form.password,
        role: form.role,
      });

      navigate("/verify-otp", {
        state: { userId: res.data.data.userId },
      });
    } catch (err) {
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
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwMlw0wqg8kUWVOTKWz_6pHRKrjLuWohYAY82YUXQLIpJQsBxxy2zkUVWl2PEFl-4dLjGsatiSOZA2Nhs5ufKE8TcKD2sFTiR7dwaV5EEAvgl8srfCREYosnjrF1MT8-tJz1FCiy0JVk73aQvPaalTp23I9CuGjsrcVVoSn33eKTE_9XH6rcOykoz3L9DZQlubovWK8I6-MvlNBPUh6lZG9X12LvF3l_wJ5ETIkgb3ov5yC_nRPAjtvl_y2FiM6iMETUFnzdWxXf1z")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f3d2b]/90 to-[#1f3d2b]/30"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/20">
              🌾
            </div>
            <span className="text-2xl font-bold">AgriRent</span>
          </div> */}

          <div className="max-w-md">
            <p className="text-2xl font-medium leading-relaxed mb-6">
              "AgriRent has revolutionized how we manage our machinery during
              peak harvest."
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex flex-1 flex-col justify-center items-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[520px] flex flex-col gap-8 py-8">
          {/* Header */}
          <div>
            <h1 className="text-[32px] font-bold text-[#2B2B2B] dark:text-white">
              Join AgriRent
            </h1>
            <p className="text-[#5E5E5E] dark:text-gray-400">
              Select your role to get started.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                <div className="p-5 rounded-xl border border-gray-200 bg-white peer-checked:border-[#1f3d2b] peer-checked:bg-green-50">
                  I am a Farmer
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
                <div className="p-5 rounded-xl border border-gray-200 bg-white peer-checked:border-[#1f3d2b] peer-checked:bg-green-50">
                  I am an Owner
                </div>
              </label>
            </div>

            {/* INPUTS */}

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-500 
pl-4 py-3 bg-transparent 
text-white placeholder-gray-400
focus:border-[#1f3d2b] focus:ring-[#1f3d2b]"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-500 
pl-4 py-3 bg-transparent 
text-white placeholder-gray-400
focus:border-[#1f3d2b] focus:ring-[#1f3d2b]"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-500 
pl-4 py-3 bg-transparent 
text-white placeholder-gray-400
focus:border-[#1f3d2b] focus:ring-[#1f3d2b]"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-500 
pl-4 py-3 bg-transparent 
text-white placeholder-gray-400
focus:border-[#1f3d2b] focus:ring-[#1f3d2b]"
            />

            {/* TERMS */}
            <label className="flex gap-2 text-sm text-[#5E5E5E]">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
              />
              I agree to Terms & Privacy Policy
            </label>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold bg-[#1f3d2b] hover:bg-green-900 transition"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {message && <p className="text-center text-sm">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
