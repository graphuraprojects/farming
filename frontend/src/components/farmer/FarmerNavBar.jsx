import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.webp";

const FarmerNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block py-2 font-medium transition-all duration-300
     ${isActive ? "text-[#4e8d67]" : "text-gray-700 hover:text-black"}
    `;

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/farmer">
            <img src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
          </Link>

          {/* Desktop Menu */}
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

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 
             cursor-pointer transition-all duration-300
             hover:text-[#4e8d67] hover:scale-105
             active:scale-95"
            >
              Login
            </button>

            <Link to="/register">
              <button
                className="px-5 py-2 text-sm font-medium text-white 
    bg-[#03a74f] rounded-md transition-all duration-300
    hover:bg-[#38864b] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1"
          >
            <span
              className={`w-6 h-[2px] bg-black transition ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
            />
            <span
              className={`w-6 h-[2px] bg-black transition ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-6 h-[2px] bg-black transition ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[400px] py-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2">
            <NavLink
              onClick={() => setMenuOpen(false)}
              to="/farmer"
              className={linkClass}
            >
              Home
            </NavLink>

            <NavLink
              onClick={() => setMenuOpen(false)}
              to="/farmer/machine-listing"
              className={linkClass}
            >
              Machines
            </NavLink>

            <NavLink
              onClick={() => setMenuOpen(false)}
              to="/farmer/rate-experience"
              className={linkClass}
            >
              About
            </NavLink>

            <NavLink
              onClick={() => setMenuOpen(false)}
              to="/farmer/contact"
              className={linkClass}
            >
              Contact
            </NavLink>

            <hr className="my-2" />

            <button className="text-left py-2 text-gray-700 hover:text-[#4e8d67]">
              Login
            </button>

            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <button className="w-full mt-2 px-4 py-2 text-white bg-[#03a74f] rounded-md hover:bg-[#38864b] transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FarmerNavBar;
