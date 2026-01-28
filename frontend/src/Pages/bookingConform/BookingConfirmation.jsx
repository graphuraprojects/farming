import React from 'react';
import MachineDetailsCard from './/MachineDetailsCard';

const BookingConfirmation = () => {
  const handleDownload = () => {
    alert("Backend Integration Required: Invoice download endpoint not yet available.");
  };

  const handleNavigate = () => {
    alert("Navigation to 'My Bookings' page");
  };

  return (
  
    <div className="min-h-screen w-full bg-bg-light text-charcoal font-display flex flex-col items-center md:justify-center pt-8 pb-24 px-4 md:py-12 md:px-6">
      
      {/* Content Wrapper */}
      <div className="w-full max-w-[800px] flex flex-col gap-6 md:gap-8">
        
        {/* Success Status */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-[32px] md:text-[48px] font-bold">check</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-charcoal">Booking Confirmed</h1>
            <p className="text-muted-olive text-sm font-medium">Booking Reference: #AR-88291</p>
          </div>
        </div>

        {/* Card Component */}
        <MachineDetailsCard />

        {/* What's Next Section */}
        <div className="space-y-6 text-left">
          <h2 className="text-lg md:text-[22px] font-bold tracking-tight px-1">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Owner Contact", desc: "Check your inbox for the owner's direct contact details." },
              { step: 2, title: "Machine Inspection", desc: "Use the AgriRent mobile app to log the machine's condition." },
              { step: 3, title: "Start Rental", desc: "Unlock the machine via the digital key in your dashboard." }
            ].map((item) => (
              <div key={item.step} className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm md:text-base">
                  {item.step}
                </div>
                <h4 className="font-bold text-charcoal text-sm md:text-base">{item.title}</h4>
                <p className="text-xs md:text-sm text-muted-olive leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
          <button 
            onClick={handleDownload}
            className="w-full flex items-center justify-center h-14 bg-primary text-white rounded-xl gap-2 md:gap-3 text-sm md:text-base font-bold hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Download Invoice
          </button>
          <button 
            onClick={handleNavigate}
            className="w-full flex items-center justify-center h-14 bg-muted-olive/15 text-primary rounded-xl gap-2 md:gap-3 text-sm md:text-base font-bold hover:border-primary/20 border-2 border-transparent transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard_customize</span>
            My Bookings
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;