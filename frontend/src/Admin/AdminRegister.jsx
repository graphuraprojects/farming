import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("\n=========== ADMIN REGISTER START ===========");
    console.log("Form State:", form);

    try {
      console.log("Sending request to backend...");

      const res = await fetch(
        "http://localhost:5000/api/adminAuth/register-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

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

      alert("Admin registered successfully");

      console.log("Navigating to dashboard...");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("ADMIN REGISTER ERROR:", error);
      alert(error.message);
    }

    console.log("=========== ADMIN REGISTER END ===========\n");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Register</h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="secretKey"
          type="password"
          placeholder="Admin Secret Key"
          className="w-full border p-3 rounded mb-6"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded font-semibold hover:bg-green-700"
        >
          Register Admin
        </button>
      </form>
    </div>
  );
}
