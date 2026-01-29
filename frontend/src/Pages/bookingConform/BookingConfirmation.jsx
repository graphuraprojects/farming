import React, { useState, useEffect } from 'react';
import MachineDetailsCard from './MachineDetailsCard'; 

const BookingConfirmation = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookingId = "AR-88291";

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const rawData = await simulateBackendResponse(); 
        setBookingData(rawData);
      } catch (err) {
        setError("Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  const handleDownload = () => alert("Downloading...");
  const handleNavigate = () => alert("Navigating...");

  if (loading) return <div className="min-h-[100dvh] flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-[100dvh] flex items-center justify-center text-red-500 px-4 text-center">{error}</div>;

  const machineProps = {
    machineName: bookingData.machine?.name,
    description: bookingData.machine?.description,
    rentalDates: `${bookingData.start_date} - ${bookingData.end_date}`,
    totalUsage: `${bookingData.usage_hours} Hours`,
    pickupLocation: bookingData.location,
    imageUrl: bookingData.machine?.image_url
  };

  return (
    <>
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-pop { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
      `}</style>

      {/* Replaced bg-bg-light, text-charcoal, font-display */}
      <div className="min-h-[100dvh] w-full bg-[#fafaf7] text-[#2b2b2b] font-['Inter',sans-serif] overflow-y-auto overflow-x-hidden">
        
        <div className="flex flex-col items-center pt-6 pb-20 px-4 md:pt-10 md:pb-32 md:px-8 lg:pt-12">
          
          <div className="w-full max-w-[800px] space-y-6 md:space-y-8">
            
            {/* HEADER */}
            <div className="text-center space-y-3 md:space-y-4">
              
              <div className="mx-auto flex items-center justify-center rounded-full bg-[#03a74f] text-white shadow-xl shadow-[#03a74f]/20 
                              h-14 w-14 md:h-20 md:w-20 
                              animate-pop">
                <span className="material-symbols-outlined font-bold text-2xl md:text-[48px]">check</span>
              </div>
              
              <div className="space-y-0.5 md:space-y-1 opacity-0 animate-slide-up delay-100">
                {/* Replaced text-charcoal */}
                <h1 className="font-bold tracking-tight text-[#2b2b2b] text-xl sm:text-2xl md:text-3xl">
                  Booking {bookingData.status}
                </h1>
                {/* Replaced text-muted-olive */}
                <p className="text-[#5b6e58] font-medium text-xs sm:text-sm">
                  Reference: #{bookingData.id}
                </p>
              </div>
            </div>

            {/* CARD */}
            <MachineDetailsCard details={machineProps} />

            {/* NEXT STEPS */}
            <div className="space-y-3 md:space-y-5 text-left">
              <h2 className="font-bold tracking-tight px-1 text-base md:text-[22px]">What's Next?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {bookingData.next_steps.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-[#03a74f]/10 shadow-sm p-3 md:p-5 flex items-center gap-3 md:flex-col md:items-start md:gap-4 md:text-left hover:shadow-md transition-shadow">
                    <div className="rounded-full bg-[#03a74f]/10 text-[#03a74f] flex items-center justify-center font-bold shrink-0 h-8 w-8 text-xs md:h-10 md:w-10 md:text-base">
                      {index + 1}
                    </div>
                    <div>
                      {/* Replaced text-charcoal */}
                      <h4 className="font-bold text-[#2b2b2b] text-sm md:text-base">{item.title}</h4>
                      {/* Replaced text-muted-olive */}
                      <p className="text-[#5b6e58] mt-0.5 md:mt-1 leading-snug text-xs md:text-[13px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
              <button 
                onClick={handleDownload} 
                className="w-full bg-[#03a74f] text-white rounded-xl font-bold 
                           hover:bg-[#38864b] transition-all duration-300 shadow-lg hover:-translate-y-0.5 
                           flex items-center justify-center gap-2 h-12 text-sm md:h-14 md:text-base cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">download</span>
                Download Invoice
              </button>

              <button 
                onClick={handleNavigate} 
                className="w-full bg-[#03a74f]/10 text-[#03a74f] rounded-xl font-bold border-2 border-transparent 
                           hover:bg-[#03a74f]/20 hover:border-[#03a74f]/20 transition-all duration-300 
                           flex items-center justify-center gap-2 h-12 text-sm md:h-14 md:text-base cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">dashboard_customize</span>
                My Bookings
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

const simulateBackendResponse = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "AR-88291",
        status: "Confirmed",
        start_date: "Oct 12",
        end_date: "Oct 15, 2023",
        usage_hours: 72,
        location: "GreenValley Hub, Sector 4, CA",
        invoice_url: "#",
        machine: {
          name: "John Deere 8R 410 Tractor",
          description: "High-performance row crop tractor",
          image_url: "https://www.deere.com/assets/images/region-4/products/tractors/row-crop-tractors/8r-8rt-row-crop-tractors/8r-410/8r_410_r4f063847_large_660c917945cea0af3aeb242ddf4c52b9540ef7cc.jpg"
        },
        next_steps: [
          { title: "Contact Owner", desc: "Check inbox for details." },
          { title: "Inspection", desc: "Log condition via App." },
          { title: "Start Rental", desc: "Unlock with digital key." }
        ]
      });
    }, 500);
  });
};

export default BookingConfirmation;