import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp";

const FarmerNavBar = () => {
  const linkClass = ({ isActive }) =>
    `relative font-medium transition-all duration-300
     ${isActive ? "text-[#4e8d67]" : "text-gray-700 hover:text-black"}
     after:absolute after:left-0 after:-bottom-1 after:h-[2px]
     after:w-full after:bg-[#4e8d67] after:transition-transform after:duration-300
     ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
    `;

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
          </div>

          {/* Center - Nav Links */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/farmer" end className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/farmer/machine-listing" className={linkClass}>
              Machines
            </NavLink>

            <NavLink to="/farmer/rate-experience" className={linkClass}>
              About
            </NavLink>

            <NavLink to="/farmer/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>

          {/* Right - Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 
             cursor-pointer transition-all duration-300
             hover:text-[#4e8d67] hover:scale-105
             active:scale-95"
            >
              Login
            </button>

            <button
              className="px-5 py-2 text-sm font-medium text-white 
              bg-[#4e8d67] rounded-md transition-all duration-300
              hover:bg-[#38664b] hover:scale-105 active:scale-95 cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FarmerNavBar;
