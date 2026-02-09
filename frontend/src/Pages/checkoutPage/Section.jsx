import React from "react";

const Section = ({ title, children, value }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-6 lg:p-8 border border-[#e6e8e6] mb-15">
      <div className="flex items-center font-serif text-2xl font-bold gap-4 mb-6 pb-4 border-b border-[#e6e8e6]">
        <h2 className="font-serif text-2xl font-bold text-[#131614] flex items-center gap-4">
          <span className="flex items-center justify-center size-8 rounded-full bg-[#1f3d2b] text-white text-sm font-bold step-num">
            {value}
          </span>
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Section;
