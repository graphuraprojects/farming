import React, { useState } from "react";
import axios from "axios";
import { Mail, User, MessageSquare } from "lucide-react";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ type: "error", msg: "Please fill all fields" });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const res = await axios.post(
        "http://localhost:5000/api/contact",
        form
      );

      if (res.data.success) {
        setStatus({ type: "success", msg: "Message sent successfully" });

        // Reset form
        setForm({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      }

    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-xl shadow border border-gray-200 p-8">

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Contact Us
        </h2>

        <p className="text-gray-600 mb-6">
          Have questions or need support? Send us a message.
        </p>

        {/* Status Message */}
        {status && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Name
            </label>

            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 border rounded-lg border-gray-300 focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border rounded-lg border-gray-300 focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Subject
            </label>

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full mt-1 px-4 py-3 border rounded-lg border-gray-300 focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Message
            </label>

            <div className="relative mt-1">
              <MessageSquare
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write your message..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg border-gray-300 focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#03a74f] hover:bg-[#028a42] text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ContactForm;
