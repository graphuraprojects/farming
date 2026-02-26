import React, { useState } from "react";
import axios from "axios";
import { color, gradientBg, shadow } from "../../theme";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`/api/contact`, form);

      if (res.data.success) {
        alert("Message sent successfully ✅");

        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      alert("Failed to send message ❌", err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: color.bg }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 8px 24px ${color.emerald}30` }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3"
            style={{
              backgroundImage: gradientBg(color.emerald, color.forest),
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Get In Touch
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: color.textSoft }}>
            Have questions or feedback? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-3xl p-8 md:p-12"
          style={{ boxShadow: shadow.lg, border: `1px solid ${color.border}` }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400 group-focus-within:text-[#047857] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={inputCls}
                    style={{ border: `1.5px solid ${color.inputBorder}` }}
                    onFocus={(e) => e.target.style.borderColor = color.emerald}
                    onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400 group-focus-within:text-[#047857] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className={inputCls}
                    style={{ border: `1.5px solid ${color.inputBorder}` }}
                    onFocus={(e) => e.target.style.borderColor = color.emerald}
                    onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="group">
              <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
                Subject
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400 group-focus-within:text-[#047857] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  className={inputCls}
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                />
              </div>
            </div>

            {/* Message */}
            <div className="group">
              <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
                Message
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400 group-focus-within:text-[#047857] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <textarea
                  name="message"
                  rows="6"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none resize-none transition-all duration-200 placeholder:text-gray-400"
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-3.5 flex gap-2 justify-center items-center rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }}
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
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
