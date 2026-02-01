import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setMessage("Email and password are required");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data.data;

      // Save token (localStorage for now)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful");

      // Redirect based on role
      if (user.role === "farmer") navigate("/");
      else navigate("/owner");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back 👋</h1>
        <p className="text-center text-gray-500 mb-6">
          Login to your AgriRent account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1f3d2b]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1f3d2b]"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-[#1f3d2b] text-white rounded-lg font-semibold hover:bg-green-900 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#1f3d2b] font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
