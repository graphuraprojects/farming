import React from "react";
import { Link } from "react-router-dom";
import {
  Banknote,
  ShieldCheck,
  Handshake,
  Compass,
  BadgeIndianRupee,
  MoveRight,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBolt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import { motion } from "framer-motion";
const Home = () => {
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
    <div>
      {/* hero section */}
      <section className="relative h-[380px] md:h-[420px] lg:h-[450px]">
        <img
          src="https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb"
          alt="home-banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/50 to-black/70 flex flex-col px-5 items-start pt-10 md:gap-4">
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
            <Link className="py-2 px-3 lg:py-3 rounded-lg font-medium border-2 bg-white/20 border-white  text-white hover:-translate-y-2 transition-transform duration-300 hover:bg-white hover:text-black active:scale-95">
              List Your Equipment
            </Link>
          </div>
        </div>
        <div className="absolute top-15 right-5 lg:right-20 xl:right-35 hidden md:block fade-up">
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
                <span className="text-white font-medium">Verified Owners</span>
                <span className="text-[#46ec13] text-lg font-bold">100%</span>
              </div>
              <div className="card-three flex flex-col items-center border-2 border-[#03a74f] bg-black/60 rounded-lg py-3 px-4 -rotate-5">
                <BadgeIndianRupee size={30} className="text-orange-500" />
                <span className="text-white font-medium">Save Up To</span>
                <span className="text-[#46ec13] font-bold text-lg">40%</span>
              </div>
            </div>
          </div>
        </div>

        {/* center section */}
        <div className="absolute left-[50%] border-2 border-gray-100 bg-green-900 rounded-lg sm:px-4 py-4 xl:py-6 flex justify-center sm:gap-5 transform -translate-x-[50%] bottom-[-60px] shadow-lg fade-up">
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
        </div>
      </section>

      {/* popular category section */}
      <section className="flex justify-center">
        <div className="mx-5 pt-25 pb-15 max-w-[1280px]">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Popular Categories
          </h1>
          <p className="text-gray-500 font-medium text-sm w-full flex justify-between">
            <span>Find the right tools to you specific seasonal needs.</span>
            <Link className="text-[#03a74f] hidden sm:flex gap-2 hover:scale-105 duration-200 transition-transform active:scale-95">
              View all categories <MoveRight size={20} />
            </Link>
          </p>
          {/* category cards */}
          <div className="mt-5 flex flex-wrap gap-5 justify-center">
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
                <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <span className="absolute bottom-6 left-5 text-white font-bold text-2xl drop-shadow-lg">
                  {machine.name}
                </span>
                <span className="line absolute bottom-4 left-5 rounded-md h-1 w-12 bg-[#03a74f]"></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits section */}
      {/* <section className="bg-green-900">
        <div className="py-15 flex flex-wrap justify-center gap-10">
          <div className="group relative overflow-hidden px-8 w-full max-w-80 flex flex-col items-center gap-2 border border-[#03a74f] rounded-lg py-10 bg-white/10 hover:-translate-y-4 duration-400 transition-transform">
            <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <Banknote
              size={70}
              className="text-green-900 bg-[#03a74f] p-2 rounded-full group-hover:scale-110 group-hover:rotate-15 transition-transform duration-300"
            />
            <h2 className="text-white font-bold text-xl text-center">
              Lower Rental Costs
            </h2>
            <p className="text-gray-400 font-medium text-center">
              By renting directly from local farmers, you avoid high dealership
              fees and save up to 40% on operational costs.
            </p>
          </div>
          <div className="group relative overflow-hidden p-2 w-full max-w-80 flex flex-col items-center gap-2 border border-[#03a74f] rounded-lg py-10 bg-white/10 hover:-translate-y-4 duration-400 transition-transform">
            <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <ShieldCheck
              size={70}
              className="text-green-900 bg-[#03a74f] p-2 rounded-full group-hover:scale-110 group-hover:rotate-15 transition-transform duration-300"
            />
            <h2 className="text-white font-bold text-xl text-center">
              Vetted Equipments
            </h2>
            <p className="text-gray-400 font-medium text-center">
              Every machine on our platform is inspected and maintenance logs
              are verified by our expert field teams.
            </p>
          </div>
          <div className="group relative overflow-hidden p-2 w-full max-w-80 flex flex-col items-center gap-2 border border-[#03a74f] rounded-lg py-10 bg-white/10 hover:-translate-y-4 duration-400 transition-transform">
            <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <Handshake
              size={70}
              className="text-green-900 bg-[#03a74f] p-2 rounded-full group-hover:scale-110 group-hover:rotate-15 transition-transform duration-300"
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
      </section> */}
      <section className="flex  justify-center">
        <div className="max-w-[1280px] w-full py-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            Why It Benefits You
          </h1>
          <p className="text-gray-500 font-medium text-sm w-full text-center">
            Everything you need for affordable, reliable, and stress-free farm
            equipment rental.
          </p>
          <div className="py-15 flex flex-wrap justify-center gap-10">
            <div className="group p-8 border border-gray-200 max-w-80 bg-[#d3f9e4] shadow-lg rounded-xl hover:-translate-y-2 duration-300 transition-transform">
              <Banknote
                size={50}
                className="text-[#03a74f] bg-white rounded-full p-2 mb-3"
              />
              <h2 className="font-bold text-lg">Lower Rental Costs</h2>
              <p className="text-gray-600">
                By renting directly from local farmers, you avoid high
                dealership fees and save up to 40% on operational costs.
              </p>
            </div>
            <div className="p-8 border border-gray-200 max-w-80 bg-[#d3f9e4] shadow-lg rounded-xl">
              <ShieldCheck
                size={50}
                className="text-[#03a74f] bg-white rounded-full p-2 mb-3"
              />
              <h2 className="font-bold text-lg">Vetted Equipments</h2>
              <p className="text-gray-600">
                Every machine on our platform is inspected and maintenance logs
                are verified by our expert field teams.
              </p>
            </div>
            <div className="p-8 border border-gray-200 max-w-80 bg-[#d3f9e4] shadow-lg rounded-xl">
              <Handshake
                size={50}
                className="text-[#03a74f] bg-white rounded-full p-2 mb-3"
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
      <section className="bg-gray-100 flex justify-center">
        <div className="overflow-hidden py-10 mx-5 flex flex-col lg:flex-row justify-center lg:justify-between max-w-[1280px] w-full items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-110"
          >
            <p className="text-[#46ec13] font-bold px-2">AROUND YOU</p>
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
              Available Near You
            </h1>
            <p className="text-gray-700 font-medium mt-2">
              Discover over 1000+ machines listed within 50 miles of your
              current location. Real-time availablity for the current planting
              season.
            </p>
            <div className="group relative bg-white shadow-xl rounded-xl flex gap-2 items-center p-2 border-l-3 border-[#46ec13] mt-10 hover:-translate-y-2 cursor-pointer duration-300 transition-transform active:scale-95">
              <Compass
                size={55}
                className="text-[#46ec13] p-2 bg-[#dffed6] rounded-full group-hover:rotate-270 transition-transform duration-300"
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
      <section className="bg-green-900">
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

export default Home;
