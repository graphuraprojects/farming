import React from "react";
import { Link } from "react-router-dom";
import BoltIcon from "@mui/icons-material/Bolt";
import VerifiedIcon from "@mui/icons-material/Verified";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Banknote,
  ShieldCheck,
  Handshake,
  Compass,
  BadgeIndianRupee,
  MoveRight,
  CircleCheckBig,
  Users,
  Shield,
  Zap,
  Trophy,
  Search,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBolt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import { motion } from "framer-motion";
const FarmerHome = () => {
  
  const Categories = [
    {
      name: "Tractors",
      image:
        "https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb",
    },
    {
      name: "Harvester",
      image:
        "https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769355455/harvester_svzic4",
    },
    {
      name: "Balers",
      image:
        "https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769510002/Baler_nxadj1",
    },
    {
      name: "Seeders",
      image:
        "https://res.cloudinary.com/drq2a0262/image/upload/v1769510002/Seeder_vktpox.webp",
    },
    {
      name: "Rotavators",
      image:
        "https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769355455/Rotavator_yf7y9d",
    },
  ];
  return (
    <div className="bg-[#f2fff0]">
      {/* hero section */}
      <section className="relative h-[380px] md:h-[420px] lg:h-[450px]">
        <img
          src="https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb"
          alt="home-banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/50 to-black/70"></div>

        <div className="absolute inset-0 flex justify-center">
          <div className="max-w-[1280px] w-full px-5 flex flex-col items-start pt-10 pb-10 md:gap-4 relative">
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold fade-up">
              Rent Top-Quality <br />{" "}
              <span className="text-[#03a74f]">Farm Machinery</span> <br /> With
              Ease
            </h1>
            <p className="text-gray-200 max-w-100 lg:text-lg fade-up">
              Connect with local owners and get the equipment you need for your
              next harvest. Affordable, vetted, and right in your neighborhood
            </p>
            <div className="mt-4 flex gap-4 fade-up">
              <Link className="bg-[#03a74f] py-2 px-3 lg:py-3 rounded-lg font-medium text-white hover:bg-[#38864b] hover:-translate-y-2 transition-transform duration-300 active:scale-95">
                Rent a Machine
              </Link>
              <Link className="py-2 px-3 lg:py-3 rounded-lg font-medium border-2 bg-white/20 border-white text-white hover:-translate-y-2 transition-transform duration-300 hover:bg-white hover:text-black active:scale-95">
                List Your Equipment
              </Link>
            </div>
            {/* running tractor animation */}
            {/* <div className="absolute bottom-[85px] right-[200px] z-20 w-18 md:w-16 lg:w-184">
              <Lottie animationData={tractorAnimation} loop autoplay />
            </div> */}

            <div className="absolute top-15 right-5 lg:right-25 xl:right-35 hidden md:block fade-up">
              <div className="w-[300px] flex flex-col items-center gap-5">
                <div className="card-one flex flex-col items-center border-2 border-[#03a74f] bg-black/60 rounded-lg py-3 px-4">
                  <FontAwesomeIcon
                    icon={faBolt}
                    className="text-yellow-500 text-4xl"
                  />
                  <span className="text-white font-medium">Fast Delivery</span>
                  <span className="font-bold text-[#46ec13] text-lg">24h</span>
                </div>
                <div className="flex gap-5">
                  <div className="card-two flex flex-col items-center border-2 border-[#03a74f] bg-black/60 rounded-lg py-3 px-4 rotate-3">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-500 text-4xl"
                    />
                    <span className="text-white font-medium">
                      Verified Owners
                    </span>
                    <span className="text-[#46ec13] text-lg font-bold">
                      100%
                    </span>
                  </div>
                  <div className="card-three flex flex-col items-center border-2 border-[#03a74f] bg-black/60 rounded-lg py-3 px-4 -rotate-5">
                    <BadgeIndianRupee size={30} className="text-orange-500" />
                    <span className="text-white font-medium">Save Up To</span>
                    <span className="text-[#46ec13] font-bold text-lg">
                      40%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            className="w-full h-[140px] wave-animate"
          >
            <path
              d="
          M0,90
          C120,110 240,66 310,65
          C520,55 620,120 760,115
          C900,110 980,40 1120,35
          C1240,20 1340,40 1440,55
          L1440,160
          L0,160
          Z
        "
              fill="#f2fff0"
            />
          </svg>
        </div>
        </div>

        {/* center status  card */}
        {/* <div className="absolute left-[50%] border-2 border-gray-100 bg-green-900 rounded-lg sm:px-4 py-4 xl:py-6 flex justify-center sm:gap-5 transform -translate-x-[50%] bottom-[-60px] shadow-lg fade-up">
          <div className="flex flex-col items-center py-2 px-5">
            <span className="text-[#46ec13] text-xl font-bold">
              <CountUp end={500} duration={2} delay={1.2} />+
            </span>
            <span className="text-white font-semibold">Machines Available</span>
          </div>
          <div className="flex flex-col items-center border-x-[1.5px] border-green-700 px-10 py-2">
            <span className="text-[#46ec13] text-xl font-bold">
              <CountUp end={1000} duration={2} delay={1.2} />+
            </span>
            <span className="text-white font-semibold">Happy Farmers</span>
          </div>
          <div className="flex flex-col items-center px-5 py-2">
            <span className="text-[#46ec13] text-xl font-bold">
              <CountUp end={50} duration={4} delay={1.2} />+
            </span>
            <span className="text-white font-semibold">Cities Covered</span>
          </div>
        </div> */}
      </section>
      {/* bottom wave */}
      {/* bottom wave */}

      {/* About us section */}
      <section className="flex justify-center overflow-hidden">
        <div className="mx-5 md:mx-10 pt-10 pb-15 max-w-[1280px] w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            Empowering Farmers Through{" "}
            <span className="text-[#03a74f]">Shared Resources</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm w-full text-center">
            We connect farmers with the equipment they need, when they need it.
          </p>
          <div className="flex flex-col lg:flex-row gap-10 mt-5 md:mt-10 justify-center lg:justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-125"
            >
              <h2 className="text-xl lg:text-2xl font-bold">
                Your Trusted Partner in Farm Equipment Rental
              </h2>
              <p className="text-gray-500 font-medium text-sm">
                We understand the challenges farmers face in accessing expensive
                machinery. That's why we created a peer-to-peer marketplace that
                connects equipment owners with those who need it, making modern
                farming more accessible and affordable for everyone.
              </p>
              <div className="mt-5">
                <div className="flex gap-5 mb-3 group items-center">
                  <span className="bg-[#d3f9e4] group-hover:bg-[#6ffbae] px-2 py-2 flex items-center rounded-lg">
                    <CircleCheckBig size={30} className="text-[#03a74f]" />
                  </span>
                  <div>
                    <h3 className="font-semibold">Verified Equipment</h3>
                    <p className="text-gray-500 text-sm">
                      Every machine is inspected and verified by our expert team
                      before listing.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 mb-3 group items-center">
                  <span className="bg-[#d3f9e4] group-hover:bg-[#6ffbae] px-2 py-2 flex items-center rounded-lg">
                    <Users size={30} className="text-[#03a74f]" />
                  </span>
                  <div>
                    <h3 className="font-semibold">Community Driven</h3>
                    <p className="text-gray-500 text-sm">
                      Built by farmers, for farmers. Join a growing community of
                      agricultural innovators.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 mb-3 group items-center">
                  <span className="bg-[#d3f9e4] group-hover:bg-[#6ffbae] px-2 py-2 flex items-center rounded-lg">
                    <Shield size={30} className="text-[#03a74f]" />
                  </span>
                  <div>
                    <h3 className="font-semibold">Secure Transactions</h3>
                    <p className="text-gray-500 text-sm">
                      Safe and secure payment processing with full insurance
                      coverage on all rentals.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 group items-center">
                  <span className="bg-[#d3f9e4] group-hover:bg-[#6ffbae] px-2 py-2 flex items-center rounded-lg">
                    <Zap size={30} className="text-[#03a74f]" />
                  </span>
                  <div>
                    <h3 className="font-semibold">Quick & Easy</h3>
                    <p className="text-gray-500 text-sm">
                      Book equipment in minutes and get it delivered to your
                      farm within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative max-w-[520px] lg:max-w-[480px]"
            >
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769673280/about-us_qadiyt.jpg"
                  alt="about-us-image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* floating card experience */}
              <div
                className="absolute hidden xl:flex -bottom-10 -left-25 border-2 border-[#03a74f] 
    bg-white rounded-xl p-5 shadow-xl
     items-center gap-3"
              >
                <Trophy
                  size={50}
                  className="bg-[#d3f9e4] p-2 rounded-lg text-[#03a74f]"
                />

                <div>
                  <span className="block text-lg font-bold text-gray-900">
                    2+ Years
                  </span>
                  <span className="text-sm text-gray-600">Serving Farmers</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* popular category section */}
      <section className="flex justify-center">
              <div className="mx-5 py-15 max-w-[1280px]">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                  Popular Categories
                </h1>
                <p className="text-gray-500 font-medium text-sm w-full text-center">
                  Find the right tools to you specific seasonal needs.
                </p>
                {/* category cards */}
                <div className="mt-10 flex flex-wrap gap-5 justify-center">
                  {Categories.map((machine, index) => (
                    <div
                      className="group w-55 h-50 overflow-hidden relative rounded-2xl group cursor-pointer transition-transform duration-300 hover:-translate-y-3 shadow-lg hover:shadow-xl"
                      key={index}
                    >
                      <img
                        src={machine.image}
                        alt={machine.name}
                        className="h-full w-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                      />
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      {/* <span className="absolute bottom-6 left-5 text-white font-bold text-2xl drop-shadow-lg flex w-full justify-between">
                        <span>{machine.name}</span>{" "}
                        <Link className="view-link text-white hidden sm:flex gap-2 active:scale-95 duration-200 transition-transform">
                          <MoveRight size={20} className="pt-1" />
                        </Link>
                      </span> */}
                      <p className="absolute bottom-6 left-5 text-white font-bold text-2xl drop-shadow-lg flex w-full items-center justify-between">
                        <span>{machine.name}</span>
                        <MoveRight size={35} className="mr-8 pt-1 view-link" />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

      {/* Benefits section */}
      <section className="flex  justify-center">
        <div className="max-w-[1280px] w-full py-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            Why It Benefits You
          </h1>
          <p className="text-gray-500 font-medium text-sm w-full text-center mt-2">
            Everything you need for affordable, reliable, and stress-free farm
            equipment rental.
          </p>
          <div className="py-15 flex flex-wrap justify-center gap-10">
            <div className="group px-8 py-6 border border-gray-200 max-w-80 bg-[#d3f9e4] shadow-lg rounded-xl hover:-translate-y-2 duration-300 transition-transform">
              <Banknote
                size={50}
                className="text-[#03a74f] bg-white rounded-full p-2 mb-3 group-hover:-translate-y-1 group-hover:rotate-15 group-hover:scale-120 transition-transform duration-300"
              />
              <h2 className="font-bold text-lg">Lower Rental Costs</h2>
              <p className="text-gray-600">
                By renting directly from local farmers, you avoid high
                dealership fees and save up to 40% on operational costs.
              </p>
            </div>
            <div className="group px-8 py-6 border border-gray-200 max-w-80 bg-[#d3f9e4] shadow-lg rounded-xl hover:-translate-y-2 duration-300 transition-transform">
              <ShieldCheck
                size={50}
                className="text-[#03a74f] bg-white rounded-full p-2 mb-3 group-hover:-translate-y-1 group-hover:rotate-15 group-hover:scale-120 transition-transform duration-300"
              />
              <h2 className="font-bold text-lg">Vetted Equipments</h2>
              <p className="text-gray-600">
                Every machine on our platform is inspected and maintenance logs
                are verified by our expert field teams.
              </p>
            </div>
            <div className="group px-8 py-6 border border-gray-200 max-w-80 bg-[#d3f9e4] shadow-lg rounded-xl hover:-translate-y-2 duration-300 transition-transform">
              <Handshake
                size={50}
                className="text-[#03a74f] bg-white rounded-full p-2 mb-3 group-hover:-translate-y-1 group-hover:rotate-15 group-hover:scale-120 transition-transform duration-300"
              />
              <h2 className="font-bold text-lg">Local Support</h2>
              <p className="text-gray-600">
                Get equipment from neighbours who know your local terrain and
                are available to help with setup and operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* available machines section */}
      <section className="flex justify-center overflow-hidden">
        <div className="mb-10 mx-5 md:mx-10 flex flex-col lg:flex-row justify-center lg:justify-between max-w-[1280px] w-full items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-110"
          >
            <p className="text-[#03a74f] font-bold px-2">AROUND YOU</p>
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
              Available Near You
            </h1>
            <p className="text-gray-700 font-medium mt-2">
              Discover over 1000+ machines listed within 50 miles of your
              current location. Real-time availablity for the current planting
              season.
            </p>
            <div className="group relative shadow-[0_6px_18px_rgba(0,0,0,0.12)] rounded-xl flex gap-2 items-center p-2 border-l-3 border-[#03a74f] mt-10 hover:-translate-y-2 cursor-pointer duration-300 transition-transform active:scale-95">
              <Search
                size={55}
                className="text-[#03a74f] p-3 bg-[#d3f9e4] rounded-full group-hover:rotate-90 transition-transform duration-300"
              />
              <div>
                <h5 className="font-semibold">Quick Search</h5>
                <p className="text-gray-500 text-sm">
                  Find the right tools for your harvest in seconds.
                </p>
              </div>
              <FontAwesomeIcon
                icon={faAngleRight}
                className="absolute right-3 text-gray-400"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex gap-2 flex-wrap rounded-2xl overflow-hidden py-5"
          >
            <div className="w-40 sm:w-50 lg:w-60 rounded-2xl overflow-hidden h-[260px] sm:h-[360px] shadow-md">
              <img
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355456/tractor_gvdqwu.jpg"
                alt="tractor-image"
              />
            </div>
            <div className="w-40 sm:w-60 lg:w-70 h-[260px] sm:h-[360px] flex flex-col gap-2 rounded-2xl overflow-hidden">
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  className="hover:scale-105 transition-transform duration-300"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355455/harvester_svzic4.jpg"
                  alt="harvester"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  className="hover:scale-105 transition-transform duration-300"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355455/Rotavator_yf7y9d.jpg"
                  alt="Rotavator"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* start monetizing section */}
      <section className="bg-green-900 mb-15">
        <div className="py-10 flex flex-col items-center gap-3">
          <h1 className="text-white text-2xl md:text-3xl lg:text-5xl font-bold text-center">
            Ready to monetize <br /> your machinery?
          </h1>
          <p className="text-gray-200 text-center px-2 max-w-125">
            Join thousands of farmers who are reducing their overhead and
            supporting the community by sharing their equipment safely.
          </p>
          <button className="bg-[#03a74f] text-white hover:bg-[#38864b] cursor-pointer hover:-translate-y-1 transition-transform duration-300 font-semibold rounded-xl py-3 px-4 active:scale-95">
            Start Listing Today
          </button>
          <span className="flex gap-2 text-white text-center">
            <ShieldCheck size={25} className="text-[#03a74f]" />
            No credit card required • Free to list • Instant approval
          </span>
        </div>
      </section>
    </div>
  );
};

export default FarmerHome;
