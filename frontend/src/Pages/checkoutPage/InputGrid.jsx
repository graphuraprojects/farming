import React from "react";

const InputGrid = () => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="space-y-1.5">
        <label class="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          First Name
        </label>
        <input
          class="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
          placeholder="Enter Your Name"
          type="text"
        />
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          Last Name
        </label>
        <input
          class="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
          placeholder="Enter Your Last Name"
          type="text"
        />
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          Phone Number
        </label>
        <div class="relative">
          <input
            class="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
            placeholder="+91 1235875452"
            type="tel"
          />
        </div>
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
          Email Address
        </label>
        <input
          class="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
          placeholder="Enter Your Email"
          type="email"
        />
      </div>
    </div>
  );
};

export default InputGrid;
