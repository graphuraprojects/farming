import React from 'react';

const MachineDetailsCard = ({ details }) => {
  const { 
    machineName = "Unknown Machine",
    description = "No description available",
    rentalDates = "Dates pending",
    totalUsage = "0 Hours",
    pickupLocation = "Location pending",
    imageUrl
  } = details || {};

  return (
    // Replaced bg-linen, border-primary
    <div className="bg-[#f4f3ee]/80 backdrop-blur-sm border border-[#1f3d2b]/5 rounded-xl shadow-sm w-full p-4 sm:p-6 lg:p-8 transition-all">
      
      {/* Layout: Stacked on Mobile, Row on Tablet+ */}
      <div className="flex flex-col-reverse md:flex-row gap-5 md:gap-6 lg:gap-8 items-start">
        
        {/* Left Content */}
        <div className="flex-1 w-full space-y-3 md:space-y-4 text-left">
          <div>
            {/* Replaced text-primary */}
            <h3 className="text-[#1f3d2b]/60 uppercase tracking-widest text-[10px] sm:text-xs font-bold mb-1">
              Machine Name
            </h3>
            {/* Replaced text-charcoal */}
            <h2 className="text-[#2b2b2b] font-bold leading-tight text-lg sm:text-xl lg:text-2xl">
              {machineName}
            </h2>
            {/* Replaced text-muted-olive */}
            <p className="text-[#5b6e58] mt-1 text-xs sm:text-sm lg:text-base leading-snug">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-y-3 gap-x-6 pt-2">
            
            {/* Item 1 */}
            <div className="w-full sm:w-auto min-w-[120px]">
              <p className="text-[#1f3d2b]/60 uppercase text-[9px] sm:text-[10px] font-bold mb-0.5">Rental Dates</p>
              <div className="flex items-center gap-1.5 text-[#2b2b2b] font-semibold text-xs sm:text-sm">
                <span className="material-symbols-outlined text-sm sm:text-base">calendar_today</span>
                {rentalDates}
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="w-full sm:w-auto min-w-[120px]">
              <p className="text-[#1f3d2b]/60 uppercase text-[9px] sm:text-[10px] font-bold mb-0.5">Total Usage</p>
              <div className="flex items-center gap-1.5 text-[#2b2b2b] font-semibold text-xs sm:text-sm">
                <span className="material-symbols-outlined text-sm sm:text-base">timer</span>
                {totalUsage}
              </div>
            </div>

            {/* Item 3 */}
            <div className="w-full pt-1">
              <p className="text-[#1f3d2b]/60 uppercase text-[9px] sm:text-[10px] font-bold mb-0.5">Pickup Location</p>
              <div className="flex items-center gap-1.5 text-[#2b2b2b] font-semibold text-xs sm:text-sm">
                <span className="material-symbols-outlined text-sm sm:text-base shrink-0">location_on</span>
                <span className="truncate">{pickupLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div 
          className="bg-center bg-no-repeat bg-cover rounded-lg shadow-inner shrink-0 w-full h-40 sm:h-48 md:w-1/3 md:h-auto md:min-h-[200px] lg:w-[320px]"
          style={{ backgroundImage: `url('${imageUrl}')` }}
          role="img"
          aria-label={machineName}
        >
        </div>
      </div>
    </div>
  );
};

export default MachineDetailsCard;