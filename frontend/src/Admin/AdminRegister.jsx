import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Key, Shield, Eye, EyeOff } from "lucide-react";
import { color, shadow, gradientBg } from "../theme";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("\n=========== ADMIN REGISTER START ===========");
    console.log("Form State:", form);

    try {
      setLoading(true);
      console.log("Sending request to backend...");

      const res = await fetch(`/api/adminAuth/register-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("Response Status:", res.status);
      console.log("Response Headers:", [...res.headers.entries()]);

      let data;

      try {
        console.log("Parsing response JSON...");
        data = await res.json();
        console.log("Parsed Response Data:", data);
      } catch (parseError) {
        console.error("JSON Parsing Failed:", parseError);
        throw new Error("Server returned invalid response");
      }

      if (!res.ok) {
        console.error("Backend returned error:", data);
        throw new Error(data.message);
      }

      console.log("Admin registration successful");
      console.log("Token received:", data.token);

      localStorage.setItem("token", data.token);

      alert("✅ Admin registered successfully");

      console.log("Navigating to dashboard...");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("ADMIN REGISTER ERROR:", error);
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }

    console.log("=========== ADMIN REGISTER END ===========\n");
  };

  const inputCls =
    "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 bg-white";
  const inputWithToggleCls =
    "w-full pl-12 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: color.bg }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 transition-transform duration-300 hover:scale-105"
            style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 8px 32px ${color.emerald}30` }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={
            { backgroundImage: gradientBg(color.emerald, color.forest), WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
          }>
            Admin Portal
          </h1>
          <p className="text-sm" style={{ color: color.textSoft }}>Create your administrator account</p>
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-3xl"
          style={{ boxShadow: shadow.lg, border: `1px solid ${color.border}` }}
        >
          {/* Name Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2" style={{ color: color.text }}>
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5" style={{ color: color.textSoft }} />
              </div>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputCls}
                style={{ border: `1.5px solid ${color.inputBorder}` }}
                onFocus={(e) => { e.target.style.borderColor = color.emerald; e.target.style.boxShadow = `0 0 0 3px ${color.emerald}15`; }}
                onBlur={(e) => { e.target.style.borderColor = color.inputBorder; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2" style={{ color: color.text }}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5" style={{ color: color.textSoft }} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className={inputCls}
                style={{ border: `1.5px solid ${color.inputBorder}` }}
                onFocus={(e) => { e.target.style.borderColor = color.emerald; e.target.style.boxShadow = `0 0 0 3px ${color.emerald}15`; }}
                onBlur={(e) => { e.target.style.borderColor = color.inputBorder; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2" style={{ color: color.text }}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5" style={{ color: color.textSoft }} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                className={inputWithToggleCls}
                style={{ border: `1.5px solid ${color.inputBorder}` }}
                onFocus={(e) => { e.target.style.borderColor = color.emerald; e.target.style.boxShadow = `0 0 0 3px ${color.emerald}15`; }}
                onBlur={(e) => { e.target.style.borderColor = color.inputBorder; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                style={{ color: color.textSoft }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Secret Key Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: color.text }}>
              Admin Secret Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="w-5 h-5" style={{ color: color.textSoft }} />
              </div>
              <input
                name="secretKey"
                type={showSecretKey ? "text" : "password"}
                placeholder="Enter admin secret key"
                value={form.secretKey}
                onChange={handleChange}
                required
                className={inputWithToggleCls}
                style={{ border: `1.5px solid ${color.inputBorder}` }}
                onFocus={(e) => { e.target.style.borderColor = color.emerald; e.target.style.boxShadow = `0 0 0 3px ${color.emerald}15`; }}
                onBlur={(e) => { e.target.style.borderColor = color.inputBorder; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                style={{ color: color.textSoft }}
              >
                {showSecretKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs flex items-center gap-1" style={{ color: color.textSoft }}>
              <Shield className="w-3 h-3" />
              Required for administrator registration
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
            style={
              loading
                ? { background: "#9ca3af", cursor: "not-allowed" }
                : { background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }
            }
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Create Admin Account
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: color.textSoft }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: color.emerald }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 rounded-xl" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
          <p className="text-xs flex items-center gap-2" style={{ color: "#92400e" }}>
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Admin registration requires a valid secret key. Contact your
              system administrator if you don't have one.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
