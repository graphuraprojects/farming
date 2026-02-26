import { Link } from "react-router-dom";
import logo1 from "../../assets/logo1.webp";
import { color, gradientBg } from "../../theme";

const FarmerFooter = () => {
  return (
    <footer style={{ background: color.deepForest }}>
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <img src={logo1} alt="Logo" className="h-8 mb-5" />
            <p className="text-sm text-gray-400 leading-relaxed">
              A smart platform to rent and book farm machinery easily.
              Helping farmers and machine owners grow together.
            </p>
          </div>

          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[2px] mb-5"
              style={{ color: color.sage }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  to="/"
                  className="transition-colors duration-200"
                  style={{ color: undefined }}
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/machine-listing"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  Machines
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Farmer Links */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[2px] mb-5"
              style={{ color: color.sage }}
            >
              Farmer
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  to="/profile"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/booking-history"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[2px] mb-5"
              style={{ color: color.sage }}
            >
              Support
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  to="/P"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/T&C"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => e.target.style.color = color.lush}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-10" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Graphura India Private Limited. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <a
              target="_blank"
              href="https://www.facebook.com/Graphura.in"
              className="transition-colors duration-200"
              onMouseEnter={(e) => e.target.style.color = color.lush}
              onMouseLeave={(e) => e.target.style.color = ""}
            >
              Facebook
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/Graphura.in"
              className="transition-colors duration-200"
              onMouseEnter={(e) => e.target.style.color = color.lush}
              onMouseLeave={(e) => e.target.style.color = ""}
            >
              Instagram
            </a>
            <a
              target="_blank"
              href="https://x.com/Graphura"
              className="transition-colors duration-200"
              onMouseEnter={(e) => e.target.style.color = color.lush}
              onMouseLeave={(e) => e.target.style.color = ""}
            >
              Twitter
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FarmerFooter;
