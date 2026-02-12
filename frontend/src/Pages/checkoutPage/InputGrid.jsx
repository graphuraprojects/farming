import React from "react";

const InputGrid = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          First Name
        </label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
          placeholder="Enter Your Name"
          type="text"
        />
         {errors.firstName && (
          <p className="text-red-500 text-xs">{errors.firstName}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          Last Name
        </label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
          placeholder="Enter Your Last Name"
          type="text"
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs">{errors.lastName}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          Phone Number
        </label>
        <div className="relative">
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
            placeholder="+91 1235875452"
            type="tel"
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          Email Address
        </label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
          placeholder="Enter Your Email"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}
      </div>
    </div>
  );
};

export default InputGrid;
