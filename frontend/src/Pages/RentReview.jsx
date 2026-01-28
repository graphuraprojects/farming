import React from "react";
import {Share2, Check} from "lucide-react";

export default function ReviewSuccessPage() {

  return (
    <div className="w-full min-h-screen bg-white text-[#1a1a1a] overflow-x-hidden">

      {/* SUCCESS */}
      <section className="text-center py-8 sm:py-12 lg:py-16 px-4 bg-[#f7f7f7] sm:bg-white">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c7f3d6] flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#22c55e] flex items-center justify-center">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]" />
          </div>
        </div>

        <h1 className="mt-4 sm:mt-6 text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#1a1a1a] px-2">Review Successfully Submitted!</h1>
        <p className="mt-2 sm:mt-3 text-[13px] sm:text-[16px] text-[#666] max-w-md sm:max-w-lg mx-auto leading-relaxed px-2">
          Your feedback helps the AgriRent community grow stronger. Your contribution ensures fellow farmers find the best equipment for their next harvest.
        </p>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 px-4 max-w-md sm:max-w-none mx-auto">
          <button className="h-11 px-6 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg text-[14px] sm:text-[15px] font-bold transition-all active:scale-95 hover:shadow-lg cursor-pointer">View My Review</button>
          <button className="h-11 px-6 bg-[#1a1a1a] hover:bg-[#000] text-white rounded-lg text-[14px] sm:text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 hover:shadow-lg cursor-pointer">
            <Share2 className="w-4 h-4" /> Share Impact
          </button>
        </div>
      </section>

      {/* TRUST BUILDER */}
      <section className="w-full px-4 sm:px-6 mt-6 sm:mt-8 bg-[#f7f7f7] sm:bg-white py-6 sm:py-0">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] sm:text-[12px] text-center tracking-[0.15em] sm:tracking-[0.25em] text-[#8a9089] uppercase font-semibold mb-5 sm:mb-8">Trust Builder Impact</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {["Community Points", "Machine Rating", "Helpful Votes"].map((title, i) => (
              <div key={i} className={`bg-white rounded-lg sm:rounded-xl border border-[#e8e8e8] px-4 sm:px-6 py-4 sm:py-5 shadow-sm ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                <p className="text-[11px] sm:text-[14px] text-[#8a9089] font-medium mb-2">{title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-[#1a1a1a]">{i === 0 ? "+50" : i === 1 ? "4.8/5" : "2.4k"}</span>
                  <span className="text-[12px] sm:text-[14px] text-[#22c55e] font-bold">{i === 0 ? "+10%" : i === 1 ? "+0.2%" : "+5%"}</span>
                </div>
                <p className="text-[11px] sm:text-[13px] text-[#999] mt-1.5">{i === 0 ? 'Reached "Silver Contributor"' : i === 1 ? "Based on 124 reviews" : "Total across your profile"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section className="w-full px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold mb-5 sm:mb-6 text-[#1a1a1a]">Equipment for Your Next Phase</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white rounded-xl overflow-hidden border border-[#e8e8e8] shadow-sm">
              <div className="relative">
                    <img src="/assets/image/John Deere S780.webp" alt="John Deere S780 Combine" className="h-[180px] sm:h-[200px] w-full object-cover" loading="lazy" />
                <span className="absolute top-3 left-3 bg-[#22c55e] text-white text-[11px] px-3 py-1.5 rounded font-bold tracking-wide uppercase">Book Again</span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-[17px] sm:text-[18px] text-[#1a1a1a]">John Deere S780 Combine</h3>
                <p className="text-[12px] sm:text-[13px] text-[#b8865f] mt-1">Last rented: Oct 12 - Oct 15</p>
                <div className="flex items-center justify-between mt-4 sm:mt-5">
                  <span className="text-[#22c55e] font-bold text-[22px] sm:text-[24px]">₹99,600<span className="text-[12px] sm:text-[13px] text-[#999] font-normal"> /day</span></span>
                  <button className="h-10 sm:h-11 px-5 sm:px-6 bg-[#1a1a1a] text-white rounded-lg text-[14px] sm:text-[15px] font-bold hover:bg-[#000] transition-all active:scale-95 hover:shadow-lg cursor-pointer">Rent Now</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-[#e8e8e8] shadow-sm">
              <div className="relative">
                  <img src="/assets/image/Magnum 315.webp" alt="Case IH Magnum 340" className="h-[180px] sm:h-[200px] w-full object-cover" loading="lazy" />
                <span className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[11px] px-3 py-1.5 rounded font-bold tracking-wide uppercase">Recommended</span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-[17px] sm:text-[18px] text-[#1a1a1a]">Case IH Magnum 340</h3>
                <p className="text-[12px] sm:text-[13px] text-[#b8865f] mt-1">Matches your harvest capacity</p>
                <div className="flex items-center justify-between mt-4 sm:mt-5">
                  <span className="text-[#22c55e] font-bold text-[22px] sm:text-[24px]">₹70,550<span className="text-[12px] sm:text-[13px] text-[#999] font-normal"> /day</span></span>
                  <button className="h-10 sm:h-11 px-5 sm:px-6 rounded-lg border-2 border-[#1a1a1a] text-[14px] sm:text-[15px] font-bold hover:bg-[#f5f5f5] transition-all active:scale-95 hover:shadow-lg cursor-pointer">Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHARE */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-16 lg:py-20 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0f2a1c] to-[#0b1f15] rounded-xl sm:rounded-2xl text-white p-6 sm:p-10 lg:p-12 text-center">
          <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold">Showcase Your Fleet Integrity</h3>
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-[#b8d4c3] mt-2 sm:mt-3 max-w-md sm:max-w-xl mx-auto leading-relaxed">
            Are you an equipment owner? Share your machine's 4.8-star rating on your professional network to attract more premium renters.
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-6 max-w-md sm:max-w-md mx-auto">
            <button className="flex items-center justify-center gap-2 bg-[#0a66c2] h-12 px-6 rounded text-white text-[15px] sm:text-[16px] font-semibold hover:bg-[#004182] w-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#1877f2] h-12 px-6 rounded text-white text-[15px] sm:text-[16px] font-semibold hover:bg-[#0d5ac2] w-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
            <button className="flex items-center justify-center gap-2 h-12 px-6 rounded border-2 border-white text-white text-[15px] sm:text-[16px] font-semibold hover:bg-white/10 w-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              Copy Link
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full flex flex-col items-center justify-center px-4 sm:px-6 pb-64 sm:pb-72 lg:pb-8 text-[12px] sm:text-[13px] text-[#999] gap-3 sm:gap-4">
        <span className="text-center">© 2026 AgriRent Technologies Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}