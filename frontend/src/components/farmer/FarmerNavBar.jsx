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
            <NavLink to="/contact-us" className={linkClass}>
              Contact
            </NavLink>

            {token && (
              <NavLink to="/owner-dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            )}
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
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />

                <div className="w-9 h-9 bg-[#03a74f] text-white flex items-center justify-center rounded-full font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 top-11 w-40 bg-white border rounded-lg shadow-md overflow-hidden">
                    <Link to="/profile">
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Profile
                      </div>
                    </Link>

                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
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
            <NavLink to="/rate-experience" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/contact-us" className={linkClass}>
              Contact
            </NavLink>

            {token && (
              <NavLink to="/dashboard" className={linkClass}>
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
