import React from "react";
import {
  Tractor,
  Users,
  Award,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Heart,
  ChevronRight,
} from "lucide-react";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import { color, gradientBg, shadow } from "../../theme";
import { useState, useEffect } from "react";

const AboutUs = () => {
  const navigate = useNavigate();
  const stats = [
    { icon: Tractor, value: 500, suffix: "+", label: "Machines Listed" },
    { icon: Users, value: 2000, suffix: "+", label: "Active Users" },
    { icon: Clock, value: 10000, suffix: "+", label: "Hours Booked" },
    { icon: Award, value: 95, suffix: "%", label: "Satisfaction Rate" },
  ];
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const isFarmer = currentUser?.role === "farmer";
  const isOwner = currentUser?.role === "owner";
  const features = [
    {
      icon: MapPin,
      title: "Location-Based Discovery",
      description:
        "Find the nearest available machinery in your area with smart location tracking.",
    },
    {
      icon: Clock,
      title: "Hour-Based Pricing",
      description:
        "Flexible rental options with transparent hour-based pricing and no hidden costs.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description:
        "Safe and secure payment gateway with instant confirmation and receipts.",
    },
    {
      icon: TrendingUp,
      title: "Maximize Earnings",
      description:
        "Machine owners earn passive income by renting out idle equipment.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Empowering Farmers",
      description:
        "Making modern farming equipment accessible to every farmer, regardless of farm size.",
    },
    {
      icon: Leaf,
      title: "Sustainable Agriculture",
      description:
        "Promoting resource sharing to reduce costs and environmental impact.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Building a trusted network of farmers and equipment owners across India.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: color.bg }}>
      {/* Hero */}
      <div className="relative h-[350px] sm:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80")',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(165deg, ${color.deepForest}dd 0%, ${color.forest}bb 40%, rgba(0,0,0,0.5) 100%)`,
            }}
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <p
              className="text-xs font-semibold uppercase tracking-[4px] mb-4"
              style={{ color: color.gold }}
            >
              Our Story
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white tracking-tight">
              About <span style={{ color: color.lush }}>AgriRent</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Revolutionizing agriculture by connecting farmers with modern
              machinery through a seamless digital platform
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-20"
          style={{
            background: `linear-gradient(to top, ${color.bg}, transparent)`,
          }}
        />
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300"
                style={{
                  boxShadow: shadow.md,
                  border: `1px solid ${color.border}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: color.paleGreen }}
                >
                  <Icon className="w-6 h-6" style={{ color: color.emerald }} />
                </div>
                <h3
                  className="text-2xl font-bold mb-1"
                  style={{ color: color.text }}
                >
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    delay={0.8}
                    suffix={stat.suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </h3>
                <p className="text-sm" style={{ color: color.textSoft }}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Story */}
        <div className="mb-16">
          <div
            className="bg-white rounded-3xl p-8 sm:p-10"
            style={{
              boxShadow: shadow.md,
              border: `1px solid ${color.border}`,
            }}
          >
            <div className="text-center mb-6">
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4"
                style={{ color: color.text }}
              >
                The Story Behind AgriRent
              </h2>
            </div>
            <div
              className="text-sm leading-[1.8] space-y-4"
              style={{ color: color.textSoft }}
            >
              <p>
                AgriRent was born from a simple observation: expensive farming
                machinery sits idle for most of the year, while small and medium
                farmers struggle to afford these essential tools. We saw an
                opportunity to bridge this gap through technology.
              </p>
              <p>
                Founded by{" "}
                <span
                  className="font-semibold"
                  style={{ color: color.emerald }}
                >
                  Graphura India Private Limited
                </span>
                , our platform digitizes the agricultural machinery rental
                ecosystem, making it easier for machine owners to monetize their
                idle equipment and for farmers to access the tools they need,
                exactly when they need them.
              </p>
              <p>
                Today, we're proud to serve thousands of farmers and equipment
                owners across India, facilitating seamless rentals with
                transparent pricing, secure payments, and real-time availability
                tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p
              className="text-xs font-semibold uppercase tracking-[3px] mb-2"
              style={{ color: color.emerald }}
            >
              What We Do
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3"
              style={{ color: color.text }}
            >
              Our Mission
            </h2>
            <p
              className="text-sm max-w-2xl mx-auto"
              style={{ color: color.textSoft }}
            >
              To democratize access to modern farming equipment and empower
              every farmer with the tools they need to succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group"
                  style={{
                    boxShadow: shadow.sm,
                    border: `1px solid ${color.border}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ background: color.paleGreen }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: color.emerald }}
                    />
                  </div>
                  <h3
                    className="text-sm font-bold mb-2"
                    style={{ color: color.text }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: color.textSoft }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p
              className="text-xs font-semibold uppercase tracking-[3px] mb-2"
              style={{ color: color.emerald }}
            >
              What We Stand For
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: color.text }}
            >
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group"
                  style={{
                    boxShadow: shadow.sm,
                    border: `1px solid ${color.border}`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: gradientBg(color.emerald, color.forest),
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: color.text }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: color.textSoft }}
                  >
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-3xl p-8 sm:p-10 text-white mb-16 relative overflow-hidden"
          style={{ background: gradientBg(color.deepForest, color.emerald) }}
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">
              Ready to Transform Your Farming Experience?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of farmers and equipment owners who are already
              benefiting from our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Show Browse Machines ONLY if user is NOT owner */}
              {!isOwner && (
                <button
                  onClick={() => navigate("/machine-listing")}
                  className="group py-3.5 px-7 flex justify-center gap-2 items-center rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{
                    background: gradientBg(color.lush, color.emeraldMid),
                    boxShadow: `0 4px 16px ${color.lush}40`,
                  }}
                >
                  Browse Machines
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              )}

              {/* Show List Machine ONLY if user is NOT farmer */}
              {!isFarmer && (
                <button
                  onClick={() => navigate("/add-machine")}
                  className="group py-3.5 px-7 flex justify-center items-center gap-2 rounded-xl font-semibold border border-white/30 backdrop-blur-sm bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-[#064e3b] hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  List Your Machine
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
