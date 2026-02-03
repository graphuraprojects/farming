import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {Share2, Check, Award, Star, ThumbsUp, TrendingUp, MessageCircle, Image as ImageIcon} from "lucide-react";

export default function ReviewSuccessPage() {
  const location = useLocation();
  const reviewData = location.state?.reviewData;
  const showSubmissionMessage = location.state?.showSubmissionMessage;

  const [showCheck, setShowCheck] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [counters, setCounters] = useState({ points: 0, rating: 0, votes: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  useEffect(() => {

     window.scrollTo(0, 0);
    // Animate check icon and confetti
    setTimeout(() => {
      setShowCheck(true);
      setShowConfetti(true);
    }, 300);
    
    // Animate cards after check
    setTimeout(() => setAnimateCards(true), 800);
    
    // Initial animation to target values
    setTimeout(() => {
      let pointsCount = 0;
      const pointsInterval = setInterval(() => {
        pointsCount += 2;
        if (pointsCount >= 50) {
          pointsCount = 50;
          clearInterval(pointsInterval);
        }
        setCounters(prev => ({ ...prev, points: pointsCount }));
      }, 30);

      let ratingCount = 0;
      const ratingInterval = setInterval(() => {
        ratingCount += 0.1;
        if (ratingCount >= 4.8) {
          ratingCount = 4.8;
          clearInterval(ratingInterval);
        }
        setCounters(prev => ({ ...prev, rating: ratingCount }));
      }, 30);

      let votesCount = 0;
      const votesInterval = setInterval(() => {
        votesCount += 0.1;
        if (votesCount >= 2.4) {
          votesCount = 2.4;
          clearInterval(votesInterval);
        }
        setCounters(prev => ({ ...prev, votes: votesCount }));
      }, 30);
    }, 1000);

    // Real-time continuous updates for points and rating
    const realtimeInterval = setInterval(() => {
      setCounters(prev => ({
        ...prev,
        points: 50 + Math.floor(Math.random() * 5), // 50-54
        rating: 4.8 + (Math.random() * 0.2 - 0.1), // 4.7-4.9
      }));
    }, 2000); // Update every 2 seconds

    // Real-time continuous updates for votes - every second
    const votesInterval = setInterval(() => {
      setCounters(prev => ({
        ...prev,
        votes: 2.4 + (Math.random() * 0.3 - 0.15) // 2.25-2.55
      }));
    }, 1000); // Update every 1 second

    return () => {
      clearInterval(realtimeInterval);
      clearInterval(votesInterval);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-white text-[#1a1a1a] overflow-x-hidden">
      <style>
        {`
          @keyframes bounceIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.3);
              opacity: 1;
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
            }
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1);
            }
            50% {
              box-shadow: 0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.2);
            }
          }
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          .animate-bounce-in {
            animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          .animate-pulse-once {
            animation: pulse 0.6s ease-in-out 0.8s, glow 2s ease-in-out infinite 1.4s;
          }
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: confetti-fall 3s linear;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .gradient-shimmer {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.3),
              transparent
            );
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
          }
        `}
      </style>

      {/* SUCCESS */}
      <section className="text-center py-8 sm:py-12 lg:py-16 px-4 bg-[#f7f7f7] sm:bg-white relative overflow-hidden">
        
        <div className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c7f3d6] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-float ${showCheck ? 'animate-bounce-in' : 'scale-0 opacity-0'}`}>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#22c55e] flex items-center justify-center hover:bg-[#16a34a] transition-colors ${showCheck ? 'animate-pulse-once' : ''}`}>
            <Check className={`w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3] transition-all duration-700 delay-500 ${showCheck ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
          </div>
        </div>

        <h1 className="mt-4 sm:mt-6 text-[22px] sm:text-[28px] lg:text-[32px] font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent px-2 animate-float">Review Successfully Submitted!</h1>
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-100 rounded-full">
          <Award className="w-4 h-4 text-green-600" />
          <span className="text-[13px] font-semibold text-green-700">+10 Community Points Earned</span>
        </div>
        <p className="mt-2 sm:mt-3 text-[13px] sm:text-[16px] text-[#666] max-w-md sm:max-w-lg mx-auto leading-relaxed px-2">
          Your feedback helps the AgriRent community grow stronger. Your contribution ensures fellow farmers find the best equipment for their next harvest.
        </p>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 px-4 max-w-md sm:max-w-none mx-auto">
          <button onClick={() => setShowReviewModal(true)} className="h-11 px-6 bg-[#22c55e] hover:bg-[#38864b] text-white rounded-lg text-[14px] sm:text-[15px] font-bold transition-all duration-300 active:scale-95 hover:shadow-xl hover:scale-105 cursor-pointer">View My Review</button>
          <button className="h-11 px-6 bg-[#1a1a1a] hover:bg-[#000] text-white rounded-lg text-[14px] sm:text-[15px] font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 hover:shadow-xl hover:scale-105 cursor-pointer">
            <Share2 className="w-4 h-4 hover:rotate-12 transition-transform" /> Share Impact
          </button>
        </div>
      </section>

      {/* TRUST BUILDER */}
      <section className="w-full px-4 sm:px-6 mt-6 sm:mt-8 bg-[#f7f7f7] sm:bg-white py-6 sm:py-0 relative">
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] sm:text-[15px] text-center tracking-[0.15em] sm:tracking-[0.25em] text-[#8a9089] uppercase font-semibold mb-5 sm:mb-8">Trust Builder Impact</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {["Community Points", "Machine Rating", "Helpful Votes"].map((title, i) => {
              const icons = [Award, Star, ThumbsUp];
              const IconComponent = icons[i];
              return (
              <div 
                key={i} 
                className={`relative bg-gradient-to-br from-white to-green-50/30 rounded-lg sm:rounded-xl border-2 border-[#e8e8e8] px-4 sm:px-6 py-4 sm:py-5 shadow-sm transition-all duration-700 hover:shadow-2xl hover:scale-105 hover:border-[#22c55e] hover:from-green-50 hover:to-white cursor-pointer overflow-hidden group ${i === 2 ? 'col-span-2 md:col-span-1' : ''} ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <IconComponent className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-[11px] sm:text-[14px] text-[#8a9089] font-semibold uppercase tracking-wide">{title}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {i === 0 ? `+${counters.points}` : i === 1 ? `${counters.rating.toFixed(1)}/5` : `${counters.votes.toFixed(1)}k`}
                  </span>
                  <span className="text-[12px] sm:text-[14px] text-[#22c55e] font-bold px-2 py-1 bg-green-100 rounded-full">{i === 0 ? "+10%" : i === 1 ? "+0.2%" : "+5%"}</span>
                </div>
                <p className="text-[11px] sm:text-[13px] text-[#999] mt-1.5">{i === 0 ? 'Reached "Silver Contributor"' : i === 1 ? "Based on 124 reviews" : "Total across your profile"}</p>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section className="w-full px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Equipment for Your Next Phase</h2>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-[12px] font-semibold text-green-700">Popular</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white rounded-xl overflow-hidden border-2 border-[#e8e8e8] shadow-sm transition-all duration-300 cursor-pointer">
              <div className="relative overflow-hidden">
                    <img src="https://imgs.search.brave.com/G75byc_g2CX6nS-w4vs7giOsfvmOXLYVz-ymyMzvTak/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3MubWFjaGluZWZp/bmRlci5jb20vOTIv/MTA2NjE5OTIvNjk3/MzcwNTNfaHVnZV8x/MDI2LmpwZw" alt="John Deere S780 Combine" className="h-[180px] sm:h-[200px] w-full object-cover transition-transform duration-500" loading="lazy" />
                <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[11px] px-3 py-1.5 rounded-full font-bold tracking-wide uppercase shadow-lg">Book Again</span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-[17px] sm:text-[18px] text-[#1a1a1a]">John Deere S780 Combine</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-[11px] text-[#666] ml-1">(4.9)</span>
                </div>
                <p className="text-[12px] sm:text-[13px] text-[#b8865f] mt-1">Last rented: Oct 12 - Oct 15</p>
                <div className="flex items-center justify-between mt-4 sm:mt-5">
                  <span className="text-[#22c55e] font-bold text-[22px] sm:text-[24px]">₹99,600<span className="text-[12px] sm:text-[13px] text-[#999] font-normal"> /day</span></span>
                  <button className="h-10 sm:h-11 px-5 sm:px-6 bg-[#1a1a1a] text-white rounded-lg text-[14px] sm:text-[15px] font-bold hover:bg-[#000] transition-all duration-300 active:scale-95 hover:shadow-xl hover:scale-105 cursor-pointer">Rent Now</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border-2 border-[#e8e8e8] shadow-sm transition-all duration-300 cursor-pointer">
              <div className="relative overflow-hidden">
                  <img src="https://imgs.search.brave.com/RtUi_dgw1xq0T_xrQPW9K6f1bicrmcubtTUmmzqA-wI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5zYW5kaGlsbHMu/Y29tL2ltZy5heGQ_/aWQ9MTAwMDM3MTU4/Mjcmd2lkPTQzMjYy/MDU5MzMmcndsPUZh/bHNlJnA9JmV4dD0m/dz0zNTAmaD0yMjAm/dD0mbHA9JmM9VHJ1/ZSZ3dD1GYWxzZSZz/ej1NYXgmcnQ9MCZj/aGVja3N1bT1wZVR0/VDJiRlFsNUdYaVhH/TVBsaFdvZGpnOUZl/TGhEd1ZPWHVuRUM0/aFVvPQ" alt="Case IH Magnum 340" className="h-[180px] sm:h-[200px] w-full object-cover transition-transform duration-500" loading="lazy" />
                <span className="absolute top-3 left-3 bg-gradient-to-r from-gray-800 to-black text-white text-[11px] px-3 py-1.5 rounded-full font-bold tracking-wide uppercase shadow-lg">Recommended</span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-[17px] sm:text-[18px] text-[#1a1a1a]">Case IH Magnum 340</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-[11px] text-[#666] ml-1">(4.8)</span>
                </div>
                <p className="text-[12px] sm:text-[13px] text-[#b8865f] mt-1">Matches your harvest capacity</p>
                <div className="flex items-center justify-between mt-4 sm:mt-5">
                  <span className="text-[#22c55e] font-bold text-[22px] sm:text-[24px]">₹70,550<span className="text-[12px] sm:text-[13px] text-[#999] font-normal"> /day</span></span>
                  <button className="h-10 sm:h-11 px-5 sm:px-6 rounded-lg border-2 border-[#1a1a1a] text-[14px] sm:text-[15px] font-bold hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 active:scale-95 hover:shadow-xl hover:scale-105 cursor-pointer">Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Premium Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#1f3d2b] via-[#22c55e] to-[#38864b] p-8 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-40 -mt-40"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white opacity-5 rounded-full -ml-30 -mb-30"></div>
              
              <div className="relative z-10">
                <p className="text-white text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">Customer Review</p>
                <h2 className="text-[28px] sm:text-[32px] font-bold text-white mt-2">Your Experience</h2>
              </div>
              
              <button
                onClick={() => setShowReviewModal(false)}
                className="relative z-10 w-10 h-10 rounded-full bg-green bg-opacity-20 hover:bg-opacity-40 flex items-center justify-center text-white text-2xl transition-all hover:scale-110 shadow-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-8 sm:p-10">
              {/* Rating Section - Enhanced */}
              <div className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-white to-[#f7f7f7] border-2 border-[#e8e8e8] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-[#8a9089] uppercase tracking-[0.15em]">Overall Rating</p>
                    <p className="text-[16px] font-semibold text-[#1a1a1a] mt-2">Your satisfaction score</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full">
                    <p className="text-[12px] font-bold text-white uppercase tracking-widest">Your Score</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-8">
  {/* LEFT: 4.0 out of 5 */}
  <div>
    <div className="flex items-baseline gap-3">
      <p className="text-[36px] font-bold text-[#1a1a1a]">
        {reviewData?.rating || 0}.0
      </p>
      <p className="text-[14px] text-[#8a9089]">out of 5</p>
    </div>

    <p className="text-[14px] font-semibold text-[#22c55e] mt-2">
      {["Poor", "Fair", "Good", "Very Good", "Excellent"][
        (reviewData?.rating || 1) - 1
      ]}{" "}
      Experience
    </p>
  </div>

  {/* RIGHT: Stars */}
  <div className="flex gap-2 mt-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-8 h-8 transition-all duration-300 ${
          i < (reviewData?.rating || 0)
            ? "fill-[#d6a545] text-[#d6a545]"
            : "text-[#e8e8e8]"
        }`}
      />
    ))}
  </div>
</div>

              </div>

              {/* Highlights Section */}
              {reviewData?.tags && reviewData.tags.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-7 bg-gradient-to-b from-[#22c55e] to-[#16a34a] rounded-full"></div>
                    <p className="text-[11px] font-bold text-[#8a9089] uppercase tracking-[0.15em]">Highlights</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {reviewData.tags.map((tag, idx) => (
                      <div
                        key={tag}
                        className="px-5 py-3 bg-gradient-to-br from-[#c7f3d6] to-[#b3efd4] text-[#0f5132] rounded-xl border-2 border-[#22c55e] border-opacity-30 font-semibold text-[13px] flex items-center gap-3 hover:shadow-md hover:scale-105 transition-all cursor-default group"
                      >
                        <span className="text-[#22c55e] font-bold text-lg group-hover:scale-125 transition-transform">✓</span>
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent my-10"></div>

              {/* Review Text Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-7 bg-gradient-to-b from-[#22c55e] to-[#16a34a] rounded-full"></div>
                  <p className="text-[11px] font-bold text-[#8a9089] uppercase tracking-[0.15em]">Detailed Review</p>
                </div>
                
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#f7f7f7] to-white border-l-4 border-[#22c55e] shadow-sm hover:shadow-md transition-all">
                  <p className="text-[15px] sm:text-[16px] text-[#1a1a1a] leading-relaxed font-medium italic">
                    "{reviewData?.review || "No review text provided"}"
                  </p>
                </div>
              </div>

              {/* Image Section */}
              {reviewData?.image && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-7 bg-gradient-to-b from-[#22c55e] to-[#16a34a] rounded-full"></div>
                    <p className="text-[11px] font-bold text-[#8a9089] uppercase tracking-[0.15em]">Photo Evidence</p>
                  </div>
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#e8e8e8] hover:shadow-2xl transition-all duration-300 group">
                    <img
                      src={reviewData.image}
                      alt="Review"
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent my-10"></div>

              {/* Metadata Section */}
              <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#c7f3d6] via-[#b3efd4] to-[#a8ead9] border-2 border-[#22c55e] border-opacity-30">
                <p className="text-[11px] font-bold text-[#0f5132] uppercase tracking-[0.15em]">Submission Details</p>
                <div className="flex items-center gap-2 mt-3">
                  <svg className="w-5 h-5 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[14px] font-semibold text-[#0f5132]">
                    {reviewData?.timestamp || "Date not available"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 h-13 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#38864b] hover:to-[#22c55e] text-white rounded-xl font-bold text-[15px] transition-all duration-300 active:scale-95 hover:shadow-lg shadow-md transform hover:-translate-y-0.5"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(reviewData?.review || "");
                    alert("Review copied to clipboard!");
                  }}
                  className="flex-1 h-13 border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white rounded-xl font-bold text-[15px] transition-all duration-300 active:scale-95 hover:shadow-lg shadow-md"
                >
                  Copy Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-16 lg:py-20 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0f2a1c] via-[#0d2419] to-[#0b1f15] rounded-xl sm:rounded-2xl text-white p-6 sm:p-10 lg:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
          <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold">Showcase Your Fleet Integrity</h3>
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-[#b8d4c3] mt-2 sm:mt-3 max-w-md sm:max-w-xl mx-auto leading-relaxed">
            Are you an equipment owner? Share your machine's 4.8-star rating on your professional network to attract more premium renters.
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-6 max-w-md sm:max-w-md mx-auto">
            <a href="https://www.linkedin.com/company/graphura-india-private-limited/" target="_blank" rel="noopener noreferrer" className="w-full">
              <button className="flex items-center justify-center gap-2 bg-[#0a66c2] h-12 px-6 rounded text-white text-[15px] sm:text-[16px] font-semibold hover:bg-[#004182] hover:scale-105 hover:shadow-xl transition-all duration-300 active:scale-95 w-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>
            </a>
            <a href="https://www.facebook.com/share/19nKAMTopZ/" target="_blank" rel="noopener noreferrer" className="w-full">
              <button className="flex items-center justify-center gap-2 bg-[#1877f2] h-12 px-6 rounded text-white text-[15px] sm:text-[16px] font-semibold hover:bg-[#0d5ac2] hover:scale-105 hover:shadow-xl transition-all duration-300 active:scale-95 w-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </a>
            <a href="https://www.instagram.com/graphura.in" target="_blank" rel="noopener noreferrer" className="w-full">
              <button className="flex items-center justify-center gap-2 h-12 px-6 rounded bg-[#22c55e] text-white text-[15px] sm:text-[16px] font-semibold hover:bg-[#16a34a] hover:scale-105 hover:shadow-xl transition-all duration-300 active:scale-95 w-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </button>
            </a>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}