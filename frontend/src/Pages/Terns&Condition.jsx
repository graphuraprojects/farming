
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Scale, 
  Truck, 
  AlertTriangle, 
  FileText, 
  CheckCircle,
  Clock,
  Banknote
} from 'lucide-react';

const TermsAndConditions = () => {


  return (
    <div className="min-h-screen bg-[#f2fff0] font-sans text-gray-800">
      
      {/* Hero Header Section */}
      <div className="relative bg-[#03a74f] py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
             {/* Abstract wave or pattern could go here */}
             <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShieldCheck size={60} className="mx-auto mb-4 text-[#46ec13]" />
            <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto">
              Please read these terms carefully before using the Farm Machinery Rental Platform.
            </p>
            <p className="mt-2 text-sm text-green-200 uppercase tracking-widest font-semibold">
              Last Updated: February 2026
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-20">
        
        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 sm:p-12 space-y-10">
            
           

            {/* Section 1: Introduction */}
            <section>
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <span className="bg-[#e6f7ed] text-[#03a74f] p-2 rounded-lg mr-3">
                  <Scale size={24} />
                </span>
                1. General Agreement & User Roles
              </h2>
              <div className="pl-4 border-l-2 border-gray-100 ml-4 space-y-3 text-gray-600">
                <p>Welcome to the Farm Machinery Rental & Booking Platform. The platform acts as an intermediary facilitating transactions between:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Farmers (Renters):</strong> Individuals seeking to rent machinery for agricultural purposes.</li>
                  <li><strong>Machine Owners (Providers):</strong> Individuals or entities listing machinery for rent.</li>
                  <li><strong>The Platform (Admin):</strong> The service provider managing the marketplace, payments, and disputes.</li>
                </ul>
                <p className="text-sm italic mt-2">Note: Users must be 18 years or older and provide valid government identification (Aadhar/PAN) during registration.</p>
              </div>
            </section>

            {/* Section 2: Booking Policy */}
            <section>
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <span className="bg-[#e6f7ed] text-[#03a74f] p-2 rounded-lg mr-3">
                  <Clock size={24} />
                </span>
                2. Booking & Hour-Based Logic
              </h2>
              <div className="pl-4 border-l-2 border-gray-100 ml-4 space-y-3 text-gray-600">
                <p>The platform operates strictly on an <strong>Hour-Based Rental Model</strong>.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Slot Reservation:</strong> Bookings are confirmed only upon successful payment of the advance or full amount.</li>
                  <li><strong>Overstay Penalty:</strong> If a machine is returned later than the booked "End Time", a penalty of <strong>1.5x the hourly rate</strong> will be charged for every extra hour.</li>
                  <li><strong>Conflict Resolution:</strong> Our system prevents double-booking. However, if a machine breaks down before a booking, the Owner must cancel immediately, and a full refund will be processed.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Payments */}
            <section>
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <span className="bg-[#e6f7ed] text-[#03a74f] p-2 rounded-lg mr-3">
                  <Banknote size={24} />
                </span>
                3. Payments, Pricing & Commission
              </h2>
              <div className="pl-4 border-l-2 border-gray-100 ml-4 space-y-3 text-gray-600">
                <p>All financial transactions are secured and monitored.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800">For Farmers</h4>
                        <p className="text-sm mt-1">Total = (Hours × Rate) + Transport Cost.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800">For Owners</h4>
                        <p className="text-sm mt-1">Earnings = 95% of Booking Amount.</p>
                        <p className="text-xs text-red-500 mt-1">*5% Platform Commission Deducted</p>
                    </div>
                </div>
              </div>
            </section>

            {/* Section 4: Transport */}
            <section>
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <span className="bg-[#e6f7ed] text-[#03a74f] p-2 rounded-lg mr-3">
                  <Truck size={24} />
                </span>
                4. Logistics & Smart Location
              </h2>
              <div className="pl-4 border-l-2 border-gray-100 ml-4 space-y-3 text-gray-600">
                <p>
                  The platform utilizes <strong>Dynamic Location Tracking</strong>. Transport costs are calculated based on the machine's <em>current</em> location (last drop-off point), not necessarily the Owner's home address. 
                </p>
                <p>The Renter (Farmer) is responsible for bearing the fuel costs for transportation unless stated otherwise in a specific offer.</p>
              </div>
            </section>

            {/* Section 5: Damages */}
            <section>
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <span className="bg-[#ffebee] text-red-500 p-2 rounded-lg mr-3">
                  <AlertTriangle size={24} />
                </span>
                5. Damages & Liability
              </h2>
              <div className="pl-4 border-l-2 border-gray-100 ml-4 space-y-3 text-gray-600">
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Owner Responsibility:</strong> Providing a fully functional machine with sufficient fuel/charge to reach the destination.</li>
                  <li><strong>Renter Responsibility:</strong> Using the machine only for its intended agricultural purpose. Any physical damage caused by negligence or misuse during the rental period is the sole liability of the Renter.</li>
                  <li><strong>Disputes:</strong> Evidence (Photos/Videos) must be uploaded to the Dispute Center within 24 hours of the incident.</li>
                </ul>
              </div>
            </section>

          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;