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

const AboutUs = () => {
  const navigate = useNavigate();
  const stats = [
    { icon: Tractor, value: 500, suffix: "+", label: "Machines Listed" },
    { icon: Users, value: 2000, suffix: "+", label: "Active Users" },
    { icon: Clock, value: 10000, suffix: "+", label: "Hours Booked" },
    { icon: Award, value: 95, suffix: "%", label: "Satisfaction Rate" },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Location-Based Discovery",
      description: "Find the nearest available machinery in your area with smart location tracking.",
    },
    {
      icon: Clock,
      title: "Hour-Based Pricing",
      description: "Flexible rental options with transparent hour-based pricing and no hidden costs.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Safe and secure payment gateway with instant confirmation and receipts.",
    },
    {
      icon: TrendingUp,
      title: "Maximize Earnings",
      description: "Machine owners earn passive income by renting out idle equipment.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Empowering Farmers",
      description: "Making modern farming equipment accessible to every farmer, regardless of farm size.",
    },
    {
      icon: Leaf,
      title: "Sustainable Agriculture",
      description: "Promoting resource sharing to reduce costs and environmental impact.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a trusted network of farmers and equipment owners across India.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[350px] sm:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center fade-up"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              About{" "}
              <span className="text-[#03a74f]">AgriRent</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
              Revolutionizing agriculture by connecting farmers with modern machinery through a seamless digital platform
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-16 fade-up">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-[#03a74f]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    delay={0.8}
                    suffix={stat.suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 sm:p-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                The Story Behind AgriRent
              </h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                AgriRent was born from a simple observation: expensive farming machinery sits idle for most of the year, while small and medium farmers struggle to afford these essential tools. We saw an opportunity to bridge this gap through technology.
              </p>
              <p>
                Founded by <span className="font-semibold text-[#03a74f]">Graphura India Private Limited</span>, our platform digitizes the agricultural machinery rental ecosystem, making it easier for machine owners to monetize their idle equipment and for farmers to access the tools they need, exactly when they need them.
              </p>
              <p>
                Today, we're proud to serve thousands of farmers and equipment owners across India, facilitating seamless rentals with transparent pricing, secure payments, and real-time availability tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              To democratize access to modern farming equipment and empower every farmer with the tools they need to succeed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#03a74f]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Our Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-[#03a74f] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-green-900 rounded-2xl p-8 sm:p-10 text-white shadow-lg mb-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to Transform Your Farming Experience?
            </h2>
            <p className="text-base text-green-100 mb-6 max-w-2xl mx-auto">
              Join thousands of farmers and equipment owners who are already benefiting from our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/machine-listing")} className="bg-[#03a74f] py-4 px-5 flex justify-center gap-3 items-center rounded-lg font-medium text-white hover:bg-[#38864b] hover:-translate-y-2 transition-transform duration-300 active:scale-95 cursor-pointer">
                Browse Machines
                <ChevronRight className="w-5 h-5 mt-1" />
              </button>
              <button onClick={() => navigate("/add-machine")} className="py-4 px-5 flex justify-center items-center gap-3 rounded-lg font-medium border-2 bg-white/20 border-white text-white hover:-translate-y-2 transition-transform duration-300 hover:bg-white hover:text-black active:scale-95 cursor-pointer">
                List Your Machine
                <ChevronRight className="w-5 h-5 mt-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;