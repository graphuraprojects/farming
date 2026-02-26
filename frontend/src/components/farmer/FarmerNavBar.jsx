import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/logo.webp";
import { ChevronDown } from "lucide-react";
import { color, gradientBg } from "../../theme";

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
        `/api/auth/logout`,
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
    `block py-2 text-sm font-medium transition-all duration-300
     ${isActive ? "text-[#047857]" : "text-gray-600 hover:text-[#047857]"}
    `;

  const handleDashboardNavigation = () => {
    if (!user?.role) return;

    if (user.role === "farmer") {
      navigate("/farmer-dashboard");
    } else if (user.role === "owner") {
      navigate("/owner-dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    }

    setDropdownOpen(false);
  };

  return (
    <nav
      className="w-full sticky top-0 z-50 backdrop-blur-lg"
      style={{
        background: "rgba(255,255,255,0.85)",
        borderBottom: `1px solid ${color.border}`,
      }}
    >
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
          <div className="hidden md:flex items-center space-x-3 relative">
            {!token ? (
              <>
                <Link to="/login">
                  <button
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-gray-50"
                    style={{ color: color.text }}
                  >
                    Login
                  </button>
                </Link>

                <Link to="/register">
                  <button
                    className="px-5 py-2 text-sm text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                    style={{
                      background: gradientBg(color.emerald, color.forest),
                      boxShadow: `0 2px 10px ${color.emerald}25`,
                    }}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div
                className="relative flex items-center gap-1.5 cursor-pointer"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div
                  className="w-9 h-9 text-white flex items-center justify-center rounded-full font-bold text-sm"
                  style={{ background: gradientBg(color.emerald, color.forest) }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  style={{ color: color.textSoft }}
                />

                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-11 w-60 bg-white rounded-2xl overflow-hidden z-50"
                    style={{
                      boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                      border: `1px solid ${color.border}`,
                      animation: "navDropIn 0.2s ease-out",
                    }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3.5" style={{ background: color.paleGreen }}>
                      <p className="text-sm font-semibold truncate" style={{ color: color.text }}>
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs truncate" style={{ color: color.textSoft }}>
                        {user?.email || "user@example.com"}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors group">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: color.paleGreen }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke={color.emerald}
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
                          <span className="text-sm font-medium" style={{ color: color.text }}>
                            My Profile
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div
                      onClick={handleDashboardNavigation}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center transition-colors">
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

                      <span className="text-sm font-medium" style={{ color: color.text }}>
                        Dashboard
                      </span>
                    </div>

                    {/* Logout */}
                    <div className="border-t" style={{ borderColor: color.border }}>
                      <div
                        onClick={handleLogout}
                        className="px-4 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-3 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <svg
                            className="w-4 h-4 text-red-500"
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
                        <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                          Logout
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <style>{`
                  @keyframes navDropIn {
                    from {
                      opacity: 0;
                      transform: translateY(-8px) scale(0.97);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0) scale(1);
                    }
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span
              className={`w-5 h-[2px] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              style={{ background: color.text }}
            />
            <span
              className={`w-5 h-[2px] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              style={{ background: color.text }}
            />
            <span
              className={`w-5 h-[2px] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              style={{ background: color.text }}
            />
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden transition-all duration-300 ${menuOpen ? "max-h-[500px] py-4" : "max-h-0 overflow-hidden"}`}
        >
          <div className="flex flex-col gap-1">
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

            <hr className="my-2" style={{ borderColor: color.border }} />

            {!token ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-sm font-medium py-2" style={{ color: color.text }}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white py-2.5 px-4 rounded-xl text-center"
                  style={{ background: gradientBg(color.emerald, color.forest) }}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <Link to="/profile" className="text-sm font-medium py-2" style={{ color: color.text }}>
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-medium py-2 text-red-500"
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
