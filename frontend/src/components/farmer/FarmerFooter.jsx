import { Link } from "react-router-dom";
import logo1 from "../../assets/logo1.webp";

const FarmerFooter = () => {
  return (
    <footer className="w-full bg-[#131614]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <img src={logo1} alt="Logo" className="h-8 mb-4" />
            <p className="text-sm text-gray-300 leading-relaxed">
              A smart platform to rent and book farm machinery easily.
              Helping farmers and machine owners grow together.
            </p>
          </div>

          {/* Farmer Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Farmer
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">

              <li>
                <Link
                  to="/machine-listing"
                  className="hover:text-[#4e8d67] transition"
                >
                  Browse Machines
                </Link>
              </li>

              <li>
                <Link
                  to="/booking-history"
                  className="hover:text-[#4e8d67] transition"
                >
                  My Bookings
                </Link>
              </li>

              <li>
                <Link
                  to="/invoice"
                  className="hover:text-[#4e8d67] transition"
                >
                  Payments
                </Link>
              </li>

            </ul>
          </div>

          {/* Machine Owner Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Machine Owner
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">

              <li>
                <Link
                  to="/add-machine"
                  className="hover:text-[#4e8d67] transition"
                >
                  List Machine
                </Link>
              </li>

              <li>
                <Link
                  to="/owner-dashboard"
                  className="hover:text-[#4e8d67] transition"
                >
                  My Machines
                </Link>
              </li>

              <li>
                <Link
                  to="/withdrawl"
                  className="hover:text-[#4e8d67] transition"
                >
                  Earnings
                </Link>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">

              <li>
                <Link
                  to="/P"
                  className="hover:text-[#4e8d67] transition"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/T&C"
                  className="hover:text-[#4e8d67] transition"
                >
                  Terms & Conditions
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Farmer Panel. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#4e8d67] transition">
              Facebook
            </a>
            <a href="#" className="hover:text-[#4e8d67] transition">
              Instagram
            </a>
            <a href="#" className="hover:text-[#4e8d67] transition">
              Twitter
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FarmerFooter;
