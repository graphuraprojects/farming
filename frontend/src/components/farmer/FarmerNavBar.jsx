import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/logo.webp";
import { ChevronDown } from "lucide-react";

const FarmerNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);

    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const linkClass = ({ isActive }) =>
    `block py-2 font-medium transition-all duration-300
     ${isActive ? "text-[#4e8d67]" : "text-gray-700 hover:text-black"}
    `;
  const handleDashboardNavigation = () => {
    if (!user?.role) return;

    if (user.role === "farmer") {
      navigate("/farmer-dashboard");
    } else if (user.role === "owner") {
      navigate("/owner-dashboard");
    } else if (user.role === "admin") {
      navigate("/admin-dashboard");
    }

    setDropdownOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/machine-listing" className={linkClass}>
              Machines
            </NavLink>
            <NavLink to="/about-us" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {!token ? (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm text-gray-700 hover:text-[#4e8d67]">
                    Login
                  </button>
                </Link>

                <Link to="/register">
                  <button className="px-5 py-2 text-sm text-white bg-[#03a74f] rounded-md">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div
                className="relative flex items-center gap-1 cursor-pointer"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="w-9 h-9 bg-[#03a74f] text-white flex items-center justify-center rounded-full font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />

                {dropdownOpen && (
                  <div className="absolute right-0 top-10 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
                    {/* User Info Section */}
                    <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors group">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <svg
                              className="w-4 h-4 text-[#03a74f]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            My Profile
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div
                      onClick={handleDashboardNavigation}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7h18M3 12h18M3 17h18"
                          />
                        </svg>
                      </div>

                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Dashboard
                      </span>
                    </div>

                    {/* Logout Button */}
                    <div className="">
                      <div
                        onClick={handleLogout}
                        className="px-4 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-3 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-red-600 group-hover:text-red-700">
                          Logout
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <style jsx>{`
                  @keyframes fade-in {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }

                  .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
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

        {/* MOBILE MENU */}
        <div
          className={`md:hidden transition-all ${menuOpen ? "max-h-[500px] py-4" : "max-h-0 overflow-hidden"}`}
        >
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/machine-listing" className={linkClass}>
              Machines
            </NavLink>
            <NavLink to="/about-us" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>

            {token && (
              <NavLink to="/owner-dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            )}

            <hr />

            {!token ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/profile">Profile</Link>

                <button
                  onClick={handleLogout}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FarmerNavBar;
