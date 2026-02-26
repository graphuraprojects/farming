import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Banknote,
  ShieldCheck,
  Handshake,
  BadgeIndianRupee,
  MoveRight,
  CircleCheckBig,
  Users,
  Shield,
  Zap,
  Trophy,
  Search,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBolt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════ */
const color = {
  emerald:     "#047857",
  emeraldMid:  "#059669",
  forest:      "#064e3b",
  deepForest:  "#022c22",
  sage:        "#a7c4a0",
  mintCream:   "#f0faf4",
  paleGreen:   "#e6f4ea",
  lush:        "#10b981",
  gold:        "#c8a55a",
  warmGold:    "#d4a853",
  ivory:       "#fdfcf8",
  bg:          "#f8faf7",
  text:        "#1a1a1a",
  textSoft:    "#6b7280",
};

const shadow = {
  sm:   "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  md:   "0 4px 16px rgba(0,0,0,0.06)",
  lg:   "0 8px 30px rgba(0,0,0,0.08)",
  xl:   "0 20px 60px rgba(0,0,0,0.1)",
  glow: `0 0 40px ${color.emerald}15, 0 8px 30px rgba(0,0,0,0.08)`,
};

/* ═══════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════ */
const fadeUp = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

const slideLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const slideRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const float = {
  animate: {
    y: [-6, 6, -6],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
const FarmerHome = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
    <div style={{ background: color.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ height: "clamp(500px, 85vh, 700px)" }}
      >
        {/* parallax background */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: heroImgY }}
        >
          <img
            src="https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb"
            alt="home-banner"
            className="w-full h-[130%] object-cover"
          />
        </motion.div>

        {/* layered overlays for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(165deg, ${color.deepForest}dd 0%, ${color.forest}bb 35%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex justify-center"
        >
          <div className="max-w-[1280px] w-full px-6 md:px-10 flex flex-col justify-center relative">

            {/* text block */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-[650px]"
            >
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="text-xs md:text-sm font-semibold uppercase tracking-[5px] mb-5"
                style={{ color: color.gold }}
              >
                India's Premier AgriTech Marketplace
              </motion.p>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-white text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight"
              >
                Unlock the Power of{" "}
                <br className="hidden sm:block" />
                <span
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${color.lush}, ${color.sage}, ${color.gold})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Modern Farming
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 mt-5 text-sm md:text-[15px] leading-[1.7] max-w-[460px]"
              >
                Rent premium machinery from verified owners near you.
                Affordable daily rates, doorstep delivery, and zero hassle — so you can focus on what matters most.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  to="/machine-listing"
                  className="group relative overflow-hidden py-3.5 px-7 rounded-xl font-semibold text-white text-sm shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
                  style={{
                    background: `linear-gradient(135deg, ${color.emerald}, ${color.forest})`,
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Machines
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${color.emeraldMid}, ${color.emerald})`,
                    }}
                  />
                </Link>
                <Link
                  to="/add-machine"
                  className="py-3.5 px-7 rounded-xl font-semibold text-white text-sm border border-white/25 backdrop-blur-md bg-white/[0.08] hover:bg-white hover:text-[#064e3b] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
                >
                  List Your Equipment
                </Link>
              </motion.div>
            </motion.div>

            {/* floating stat cards — 1 top · 2 middle · 2 bottom */}
            <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-12 xl:right-20 hidden md:flex flex-col items-center gap-4 w-[320px]">
              {/* row 1: single card centered */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-col items-center rounded-2xl py-5 px-8 w-50 backdrop-blur-xl border border-white/15 shadow-2xl"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <FontAwesomeIcon icon={faBolt} className="text-3xl" style={{ color: color.warmGold }} />
                <span className="text-white/80 font-medium mt-2 text-sm tracking-wide">Fast Delivery</span>
                <span className="font-bold text-lg" style={{ color: color.lush }}>24h</span>
              </motion.div>

              {/* row 2: two cards side by side */}
              <div className="flex gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.65 }}
                  className="flex flex-col items-center rounded-2xl py-5 px-8 w-50 backdrop-blur-xl border border-white/15 shadow-2xl rotate-2"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <FontAwesomeIcon icon={faCheck} className="text-3xl" style={{ color: color.lush }} />
                  <span className="text-white/80 font-medium mt-2 text-sm tracking-wide">Verified Owners</span>
                  <span className="font-bold text-lg" style={{ color: color.lush }}>100%</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.75 }}
                  className="flex flex-col items-center rounded-2xl py-5 w-50 backdrop-blur-xl border border-white/15 shadow-2xl -rotate-2"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <BadgeIndianRupee size={28} style={{ color: color.warmGold }} />
                  <span className="text-white/80 font-medium mt-2 text-sm tracking-wide">Save Up To</span>
                  <span className="font-bold text-lg" style={{ color: color.lush }}>40%</span>
                </motion.div>
              </div>

              {/* row 3: two cards side by side */}
              {/* <div className="flex gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.85 }}
                  className="flex flex-col items-center rounded-2xl py-5 px-8 backdrop-blur-xl border border-white/15 shadow-2xl -rotate-3"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <BadgeIndianRupee size={28} style={{ color: color.warmGold }} />
                  <span className="text-white/80 font-medium mt-2 text-sm tracking-wide">Save Up To</span>
                  <span className="font-bold text-lg" style={{ color: color.lush }}>40%</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.95 }}
                  className="flex flex-col items-center rounded-2xl py-5 px-8 backdrop-blur-xl border border-white/15 shadow-2xl rotate-2"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <BadgeIndianRupee size={28} style={{ color: color.warmGold }} />
                  <span className="text-white/80 font-medium mt-2 text-sm tracking-wide">Save Up To</span>
                  <span className="font-bold text-lg" style={{ color: color.lush }}>40%</span>
                </motion.div>
              </div> */}
            </div>
          </div>
        </motion.div>

        {/* wave divider */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[80px] sm:h-[100px]">
            <path
              d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 C1300,80 1380,50 1440,65 L1440,120 L0,120 Z"
              fill={color.bg}
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT US SECTION
          ═══════════════════════════════════════════ */}
      <section className="flex justify-center overflow-hidden">
        <div className="mx-5 md:mx-10 pt-20 pb-24 max-w-[1280px] w-full">
          {/* section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[3px] mb-3"
              style={{ color: color.emerald }}
            >
              <Leaf size={14} />
              Who We Are
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-extrabold tracking-tight" style={{ color: color.text }}>
              Empowering Farmers Through{" "}
              <span
                style={{
                  backgroundImage: `linear-gradient(135deg, ${color.emerald}, ${color.forest})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Shared Resources
              </span>
            </h1>
            <p className="text-sm mt-3 max-w-xl mx-auto leading-relaxed" style={{ color: color.textSoft }}>
              We connect farmers with the equipment they need, when they need it.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-16 justify-center lg:justify-between items-center">
            {/* left: features */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideLeft}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-[520px]"
            >
              <h2 className="text-xl lg:text-[26px] font-bold leading-snug" style={{ color: color.text }}>
                Your Trusted Partner in Farm Equipment Rental
              </h2>
              <p className="text-sm mt-3 leading-[1.8]" style={{ color: color.textSoft }}>
                We understand the challenges farmers face in accessing expensive
                machinery. That's why we created a peer-to-peer marketplace that
                connects equipment owners with those who need it, making modern
                farming more accessible and affordable for everyone.
              </p>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="mt-8 space-y-1"
              >
                {[
                  { icon: CircleCheckBig, title: "Verified Equipment", desc: "Every machine is inspected and verified by our expert team before listing." },
                  { icon: Users, title: "Community Driven", desc: "Built by farmers, for farmers. Join a growing community of agricultural innovators." },
                  { icon: Shield, title: "Secure Transactions", desc: "Safe and secure payment processing with full insurance coverage on all rentals." },
                  { icon: Zap, title: "Quick & Easy", desc: "Book equipment in minutes and get it delivered to your farm within 24 hours." },
                ].map(({ icon: Icon, title, desc }) => (
                  <motion.div
                    key={title}
                    variants={fadeUp}
                    transition={{ duration: 0.5 }}
                    className="flex gap-4 group items-start p-3 rounded-xl hover:bg-white/80 transition-colors duration-300"
                  >
                    <span
                      className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                      style={{ background: color.paleGreen }}
                    >
                      <Icon size={22} style={{ color: color.emerald }} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-[15px]" style={{ color: color.text }}>{title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: color.textSoft }}>{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* right: image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideRight}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative max-w-[520px] lg:max-w-[460px]"
            >
              {/* decorative ring */}
              <div
                className="absolute -inset-3 rounded-[2rem] opacity-20 blur-sm"
                style={{ background: `linear-gradient(135deg, ${color.emerald}, ${color.sage})` }}
              />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                <img
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769673280/about-us_qadiyt.jpg"
                  alt="about-us-image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* floating trophy card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute hidden xl:flex -bottom-6 -left-16 bg-white/95 backdrop-blur-lg rounded-2xl p-5 items-center gap-4"
                style={{ boxShadow: shadow.xl }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${color.paleGreen}, ${color.mintCream})` }}
                >
                  <Trophy size={24} style={{ color: color.emerald }} />
                </div>
                <div>
                  <span className="block text-lg font-bold" style={{ color: color.text }}>
                    2+ Years
                  </span>
                  <span className="text-sm" style={{ color: color.textSoft }}>Serving Farmers</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES SECTION
          ═══════════════════════════════════════════ */}
      <section style={{ background: color.mintCream }}>
        <div className="max-w-[1280px] mx-auto px-5 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[3px] mb-3"
              style={{ color: color.emerald }}
            >
              <Leaf size={14} />
              Browse Equipment
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-extrabold tracking-tight" style={{ color: color.text }}>
              Popular Categories
            </h1>
            <p className="text-sm mt-3" style={{ color: color.textSoft }}>
              Find the right tools to you specific seasonal needs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="flex flex-wrap gap-5 justify-center"
          >
            {Categories.map((machine, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                onClick={() =>
                  navigate(`/machine-listing?category=${machine.name}`)
                }
                className="group relative w-[220px] h-[200px] overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:-translate-y-2"
                style={{ boxShadow: shadow.lg }}
              >
                <img
                  src={machine.image}
                  alt={machine.name}
                  className="h-full w-full object-cover brightness-[0.55] group-hover:brightness-[0.75] group-hover:scale-110 transition-all duration-700 ease-out"
                />
                {/* shine sweep */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out" />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                  <span className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                    {machine.name}
                  </span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    style={{ background: `${color.emerald}cc` }}
                  >
                    <MoveRight size={16} className="text-white" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BENEFITS SECTION
          ═══════════════════════════════════════════ */}
      <section className="overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[3px] mb-3"
              style={{ color: color.emerald }}
            >
              <Leaf size={14} />
              Why Choose Us
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-extrabold tracking-tight" style={{ color: color.text }}>
              Why It Benefits You
            </h1>
            <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: color.textSoft }}>
              Everything you need for affordable, reliable, and stress-free farm
              equipment rental.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-7"
          >
            {[
              {
                icon: Banknote,
                title: "Lower Rental Costs",
                desc: "By renting directly from local farmers, you avoid high dealership fees and save up to 40% on operational costs.",
                accent: color.lush,
              },
              {
                icon: ShieldCheck,
                title: "Vetted Equipments",
                desc: "Every machine on our platform is inspected and maintenance logs are verified by our expert field teams.",
                accent: color.emerald,
              },
              {
                icon: Handshake,
                title: "Local Support",
                desc: "Get equipment from neighbours who know your local terrain and are available to help with setup and operation.",
                accent: color.forest,
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="group relative max-w-[360px] rounded-3xl p-8 cursor-default transition-all duration-500 hover:-translate-y-2 bg-white overflow-hidden"
                style={{ boxShadow: shadow.md, border: "1px solid #e8efe9" }}
              >
                {/* hover gradient reveal */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `linear-gradient(160deg, ${color.paleGreen}80, transparent 60%)` }}
                />

                {/* top accent line */}
                <div
                  className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                />

                <div className="relative z-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                      border: `1.5px solid ${accent}25`,
                    }}
                  >
                    <Icon size={26} style={{ color: accent }} />
                  </div>
                  <h2 className="font-bold text-lg mb-2" style={{ color: color.text }}>{title}</h2>
                  <p className="text-sm leading-[1.7]" style={{ color: color.textSoft }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          AVAILABLE NEAR YOU
          ═══════════════════════════════════════════ */}
      <section style={{ background: color.mintCream }} className="overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-20 flex flex-col lg:flex-row justify-between items-center gap-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideLeft}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-[460px]"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[3px] mb-3"
              style={{ color: color.emerald }}
            >
              AROUND YOU
            </span>
            <h1 className="font-extrabold text-2xl md:text-3xl lg:text-[38px] tracking-tight leading-tight" style={{ color: color.text }}>
              Available Near You
            </h1>
            <p className="mt-4 leading-[1.7]" style={{ color: color.textSoft }}>
              Discover over 1000+ machines listed within 50 miles of your
              current location. Real-time availablity for the current planting
              season.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={() => navigate("/machine-listing")}
              className="group relative rounded-2xl flex gap-4 items-center p-4 mt-10 cursor-pointer bg-white transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
              style={{
                borderLeft: `4px solid ${color.emerald}`,
                boxShadow: shadow.md,
              }}
            >
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                style={{ background: color.paleGreen }}
              >
                <Search size={22} style={{ color: color.emerald }} />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-[15px]" style={{ color: color.text }}>Quick Search</h5>
                <p className="text-sm" style={{ color: color.textSoft }}>
                  Find the right tools for your harvest in seconds.
                </p>
              </div>
              <FontAwesomeIcon
                icon={faAngleRight}
                className="text-gray-300 group-hover:translate-x-1 transition-all duration-300"
                style={{ color: undefined }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideRight}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex gap-3 py-5"
          >
            <div className="w-40 sm:w-52 lg:w-60 rounded-3xl overflow-hidden h-[260px] sm:h-[360px] ring-1 ring-black/5" style={{ boxShadow: shadow.xl }}>
              <img
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355456/tractor_gvdqwu.jpg"
                alt="tractor-image"
              />
            </div>
            <div className="w-40 sm:w-60 lg:w-72 h-[260px] sm:h-[360px] flex flex-col gap-3">
              <div className="flex-1 rounded-3xl overflow-hidden ring-1 ring-black/5" style={{ boxShadow: shadow.lg }}>
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355455/harvester_svzic4.jpg"
                  alt="harvester"
                />
              </div>
              <div className="flex-1 rounded-3xl overflow-hidden ring-1 ring-black/5" style={{ boxShadow: shadow.lg }}>
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  src="https://res.cloudinary.com/drq2a0262/image/upload/v1769355455/Rotavator_yf7y9d.jpg"
                  alt="Rotavator"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — MONETIZE SECTION
          ═══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${color.deepForest} 0%, ${color.forest} 40%, ${color.emerald} 100%)`,
        }}
      >
        {/* dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* glow orb */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: `${color.lush}25` }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="relative z-10 py-24 flex flex-col items-center gap-6 px-5"
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-white text-2xl md:text-3xl lg:text-5xl font-extrabold text-center leading-tight"
          >
            Ready to monetize <br /> your machinery?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-gray-300 text-center max-w-[480px] leading-[1.7]"
          >
            Join thousands of farmers who are reducing their overhead and
            supporting the community by sharing their equipment safely.
          </motion.p>

          <motion.button
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/add-machine")}
            className="group relative overflow-hidden text-white font-semibold rounded-xl py-3.5 px-8 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] mt-2"
            style={{
              background: `linear-gradient(135deg, ${color.lush}, ${color.emeraldMid})`,
              boxShadow: `0 8px 30px ${color.lush}40`,
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Listing Today
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>

          <motion.span
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-gray-400 text-sm mt-1"
          >
            <ShieldCheck size={18} style={{ color: color.lush }} />
            No credit card required • Free to list • Instant approval
          </motion.span>
        </motion.div>
      </section>
    </div>
  );
};

export default FarmerHome;
