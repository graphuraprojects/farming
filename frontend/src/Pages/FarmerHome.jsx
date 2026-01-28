import React from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Leaf,
  RefreshCcw,
  Tractor,
  Wheat,
  Banknote,
  ShieldCheck,
  Handshake,
  Compass,
  BadgeIndianRupee,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBolt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
const FarmerHome = () => {
  return (
    <div>
      {/* hero section */}
      <section className="relative h-[380px] md:h-[420px] lg:h-[450px]">
        <img
          src="https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb"
          alt="home-banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/50 to-black/80 flex flex-col px-5 items-start pt-10 md:gap-4">
          <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold">
            Rent Top-Quality <br />{" "}
            <span className="text-[#25bc61]">Farm Machinery</span> <br /> With
            Ease
          </h1>
          <p className="text-gray-200 max-w-100 lg:text-lg">
            Connect with local owners and get the equipment you need for your
            next harvest. Affordable, vetted, and right in your neighborhood
          </p>
          <div className="mt-4 flex gap-4">
            <Link className="bg-[#25bc61] text white py-2 px-3 lg:py-3 rounded-lg font-medium">
              Rent a Machine
            </Link>
            <Link className="py-2 px-3 lg:py-3 rounded-lg font-medium border-2 bg-white/20 border-white text-white hover:bg-white hover:text-black transition-colors">
              List Your Equipment
            </Link>
          </div>
        </div>
        <div className="absolute top-15 right-5 lg:right-20 xl:right-35 hidden md:block">
          <div className="w-[300px] flex flex-col items-center gap-5">
            <div className="card-one flex flex-col items-center border-2 border-[#46ec13] shadow-[0_0_20px_#46ec13] bg-black/60 rounded-lg py-3 px-4">
              <FontAwesomeIcon
                icon={faBolt}
                className="text-yellow-500 text-4xl"
              />
              <span className="text-white font-medium">Fast Delivery</span>
              <span className="font-bold text-[#46ec13] text-lg">24h</span>
            </div>
            <div className="flex gap-5">
              <div className="card-two flex flex-col items-center border-2 border-[#46ec13] shadow-[0_0_20px_#46ec13] bg-black/60 rounded-lg py-3 px-4 rotate-3">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-green-500 text-4xl"
                />
                <span className="text-white font-medium">Verified Owners</span>
                <span className="text-[#46ec13] text-lg font-bold">100%</span>
              </div>
              <div className="card-three flex flex-col items-center border-2 border-[#46ec13] shadow-[0_0_20px_#46ec13] bg-black/60 rounded-lg py-3 px-4 -rotate-5">
                <BadgeIndianRupee size={30} className="text-orange-500" />
                <span className="text-white font-medium">Save Up To</span>
                <span className="text-[#46ec13] font-bold text-lg">40%</span>
              </div>
            </div>
          </div>
        </div>

        {/* center section */}
        <div className="hidden absolute left-[50%] border-2 border-gray-100 bg-green-800 rounded-lg px-4 py-4 xl:py-6 sm:flex justify-center gap-5 transform -translate-x-[50%] bottom-[-60px] shadow-lg shadow-green-900">
          <div className="flex flex-col items-center py-2 px-5">
            <span className="text-[#46ec13] text-xl font-bold">500+</span>
            <span className="text-white font-semibold">Machines Available</span>
          </div>
          <div className="flex flex-col items-center border-x-[1.5px] border-green-700 px-10 py-2">
            <span className="text-[#46ec13] text-xl font-bold">1000+</span>
            <span className="text-white font-semibold">Happy Farmers</span>
          </div>
          <div className="flex flex-col items-center px-5 py-2">
            <span className="text-[#46ec13] text-xl font-bold">50+</span>
            <span className="text-white font-semibold">Cities Covered</span>
          </div>
        </div>
      </section>

      {/* popular category section */}
      <section className="bg-gray-100">
        <div className="mx-5 pt-25 pb-15">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Popular Categories
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Find the right tools to you specific seasonal needs.
          </p>
          {/* category cards */}
          <div className="mt-5 flex flex-wrap gap-5 justify-center">
            <div className="group bg-white w-50 h-45 flex flex-col gap-2 justify-center items-center rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-transform duration-300 hover:-translate-y-2 border-[#46ec13] hover:border-2 hover:bg-[#dffed6]">
              <Tractor
                size={55}
                className="text-[#46ec13] group-hover:scale-110 group-hover:rotate-15 transition-transform duration-300"
              />
              <span className="font-bold group-hover:text-[#46ec13]">
                Tractors
              </span>
            </div>
            <div className="group bg-white w-50 h-45 flex flex-col gap-2 justify-center items-center rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-transform duration-300 hover:-translate-y-2 border-[#46ec13] hover:border-2 hover:bg-[#dffed6]">
              <Wheat
                size={55}
                className="text-[#46ec13] group-hover:scale-110 group-hover:rotate-15 transition-transform duration-500"
              />
              <span className="font-bold group-hover:text-[#46ec13]">
                Harvesters
              </span>
            </div>
            <div className="group bg-white w-50 h-45 flex flex-col gap-2 justify-center items-center rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-transform duration-300 hover:-translate-y-2 border-[#46ec13] hover:border-2 hover:bg-[#dffed6]">
              <Layers
                size={55}
                className="text-[#46ec13] group-hover:scale-110 group-hover:rotate-15 transition-transform duration-500"
              />
              <span className="font-bold group-hover:text-[#46ec13]">
                Balers
              </span>
            </div>
            <div className="group bg-white w-50 h-45 flex flex-col gap-2 justify-center items-center rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-transform duration-300 hover:-translate-y-2 border-[#46ec13] hover:border-2 hover:bg-[#dffed6]">
              <Leaf
                size={55}
                className="text-[#46ec13] group-hover:scale-110 group-hover:rotate-15 transition-transform duration-500"
              />
              <span className="font-bold group-hover:text-[#46ec13]">
                Seeders
              </span>
            </div>
            <div className="group bg-white w-50 h-45 flex flex-col gap-2 justify-center items-center rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-transform duration-300 hover:-translate-y-2 border-[#46ec13] hover:border-2 hover:bg-[#dffed6]">
              <RefreshCcw
                size={55}
                className="text-[#46ec13] group-hover:scale-110 group-hover:rotate-15 transition-transform duration-500"
              />
              <span className="font-bold group-hover:text-[#46ec13]">
                Rotavator
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="bg-green-900">
        <div className="py-15 flex flex-wrap justify-center gap-10">
          <div className="group px-8 w-full max-w-80 flex flex-col items-center gap-2 border border-[#46ec13] rounded-lg py-10 bg-white/10 hover:-translate-y-4 duration-400 transition-transform">
            <Banknote
              size={70}
              className="text-green-900 bg-[#46ec13] shadow-[0_0_20px_#46ec13] p-2 rounded-full group-hover:scale-110 group-hover:rotate-15 transition-transform duration-300"
            />
            <h2 className="text-white font-bold text-xl text-center">
              Lower Rental Costs
            </h2>
            <p className="text-gray-400 font-medium text-center">
              By renting directly from local farmers, you avoid high dealership
              fees and save up to 40% on operational costs.
            </p>
          </div>
          <div className="group p-2 w-full max-w-80 flex flex-col items-center gap-2 border border-[#46ec13] rounded-lg py-10 bg-white/10 hover:-translate-y-4 duration-400 transition-transform">
            <ShieldCheck
              size={70}
              className="text-green-900 bg-[#46ec13] shadow-[0_0_20px_#46ec13] p-2 rounded-full group-hover:scale-110 group-hover:rotate-15 transition-transform duration-300"
            />
            <h2 className="text-white font-bold text-xl text-center">
              Vetted Equipments
            </h2>
            <p className="text-gray-400 font-medium text-center">
              Every machine on our platform is inspected and maintenance logs
              are verified by our expert field teams.
            </p>
          </div>
          <div className="group p-2 w-full max-w-80 flex flex-col items-center gap-2 border border-[#46ec13] rounded-lg py-10 bg-white/10 hover:-translate-y-4 duration-400 transition-transform">
            <Handshake
              size={70}
              className="text-green-900 bg-[#46ec13] shadow-[0_0_20px_#46ec13] p-2 rounded-full group-hover:scale-110 group-hover:rotate-15 transition-transform duration-300"
            />
            <h2 className="text-white font-bold text-xl text-center">
              Local Support
            </h2>
            <p className="text-gray-400 font-medium text-center">
              Get equipment from neighbors who know your local terrain and are
              available to help with setup and operation.
            </p>
          </div>
        </div>
      </section>

      {/* available machines section */}
      <section className="bg-gray-100 flex justify-center">
        <div className="py-10 mx-5 flex flex-col lg:flex-row justify-center lg:justify-between max-w-[1280px] w-full items-center">
          <div className="max-w-110">
            <p className="text-[#46ec13] font-bold px-2">AROUND YOU</p>
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
              Available Near You
            </h1>
            <p className="text-gray-700 font-medium mt-2">
              Discover over 1000+ machines listed within 50 miles of your
              current location. Real-time availablity for the current planting
              season.
            </p>
            <div className="relative bg-white shadow-xl rounded-xl flex gap-2 items-center p-2 border-l-3 border-[#46ec13] mt-10">
              <Compass
                size={55}
                className="text-[#46ec13] p-2 bg-[#dffed6] rounded-lg"
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
          </div>
          <div className="flex gap-2 flex-wrap rounded-2xl overflow-hidden py-5">
            <div className="w-40 sm:w-50 lg:w-60 rounded-2xl overflow-hidden h-[260px] sm:h-[360px] shadow-md border-l-3 border-b-3 border-t-3 border-green-500">
              <img
                className="h-full w-full object-cover"
                src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355456/tractor_gvdqwu.jpg"
                alt="tractor-image"
              />
            </div>
            <div className="w-40 sm:w-60 lg:w-70 h-[260px] sm:h-[360px] flex flex-col gap-2 rounded-2xl overflow-hidden">
              <div className="rounded-2xl overflow-hidden shadow-md border-t-3 border-r-3 border-green-500">
                <img
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355455/harvester_svzic4.jpg"
                  alt="harvester"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md border-r-3 border-b-3 border-green-500">
                <img
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355455/Rotavator_yf7y9d.jpg"
                  alt="Rotavator"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* start monetizing section */}
      <section className="bg-green-900">
        <div className="py-10 flex flex-col items-center gap-3">
          <h1 className="text-white text-2xl md:text-3xl lg:text-5xl font-bold text-center">
            Ready to monetize <br /> your machinery?
          </h1>
          <p className="text-gray-200 text-center px-2 max-w-125">
            Join thousands of farmers who are reducing their overhead and
            supporting the community by sharing their equipment safely.
          </p>
          <button className="bg-[#46ec13] font-semibold rounded-xl py-3 px-4">
            Start Listing Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default FarmerHome;
