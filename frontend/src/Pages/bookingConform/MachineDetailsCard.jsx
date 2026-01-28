import React from 'react';

const MachineDetailsCard = () => {
  return (
    
    <div className="bg-linen/80 backdrop-blur-sm border border-primary/5 rounded-xl p-6 lg:p-8 shadow-sm">
      
    
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Left Content */}
        <div className="flex-1 space-y-4 lg:space-y-6 text-left w-full">
          <div>
            <h3 className="text-primary/60 uppercase tracking-widest text-xs font-bold mb-2">
              Machine Details
            </h3>
            <h2 className="text-charcoal text-xl lg:text-2xl font-bold leading-tight">
              John Deere 8R 410 Tractor
            </h2>
            <p className="text-muted-olive mt-1 text-sm">
              High-performance row crop tractor with IVT Transmission
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 lg:gap-y-6 gap-x-4">
            <div className="space-y-1">
              <p className="text-primary/60 uppercase text-[10px] font-bold">Rental Dates</p>
              <div className="flex items-center gap-2 text-charcoal font-semibold text-sm">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Oct 12 - Oct 15, 2023
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-primary/60 uppercase text-[10px] font-bold">Total Usage</p>
              <div className="flex items-center gap-2 text-charcoal font-semibold text-sm">
                <span className="material-symbols-outlined text-sm">timer</span>
                72 Total Hours
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-1">
              <p className="text-primary/60 uppercase text-[10px] font-bold">Pickup Location</p>
              <div className="flex items-center gap-2 text-charcoal font-semibold text-sm">
                <span className="material-symbols-outlined text-sm">location_on</span>
                GreenValley Hub, Sector 4, CA
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div 
          className="w-full lg:w-[320px] h-[200px] lg:h-[180px] bg-center bg-no-repeat bg-cover rounded-lg shadow-inner shrink-0"
          style={{ backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/John_Deere_8345R_tractor.jpg/640px-John_Deere_8345R_tractor.jpg')` }}
        >
        </div>
      </div>
    </div>
  );
};

export default MachineDetailsCard;