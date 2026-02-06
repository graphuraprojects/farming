import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  MapPin, 
  Eye, 
  Server, 
  CreditCard, 
} from 'lucide-react';


const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#f2fff0] font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="bg-[#03a74f] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Lock size={50} className="mx-auto mb-4 text-[#46ec13]" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
              We value your trust. Here is how we protect your data while connecting you to the best farm machinery.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 sm:p-12 space-y-12">

            {/* Introduction */}
            <div>
              <p className="text-gray-600 text-lg leading-relaxed">
                At <strong>Farm Machinery Rental</strong>, we are committed to protecting the privacy of our Farmers and Machine Owners. This policy outlines what data we collect and how it is used to facilitate smooth rentals, accurate distance calculations, and secure payments.
              </p>
            </div>

            {/* Section 1: Information Collection */}
            <section className="flex gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#03a74f]">
                  <Server size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h3>
                <p className="text-gray-600 mb-2">To provide our services, we collect the following:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li><strong>Personal Details:</strong> Name, Phone Number, and Government ID (for verification).</li>
                  <li><strong>Account Credentials:</strong> Securely hashed passwords.</li>
                  <li><strong>Machine Data:</strong> Photos, specifications, and registration details from Owners.</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Location Data (Critical for your project) */}
            <section className="flex gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#03a74f]">
                  <MapPin size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Location Data & Tracking</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    This platform uses "Smart Location Logic" to calculate transport costs.
                  </p>
                </div>
                <p className="text-gray-600">
                  We collect precise location data from Farmers (to deliver machines) and track the active location of Machines. This data is used <strong>only</strong> to:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                  <li>Calculate accurate transport fees based on distance.</li>
                  <li>Show "Machines Near You" in search results.</li>
                  <li>Update the machine's pickup point after a rental ends.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Data Sharing */}
            <section className="flex gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#03a74f]">
                  <Eye size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. How We Share Your Data</h3>
                <p className="text-gray-600">
                  We do not sell your personal data. Data is shared only when necessary:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                  <li><strong>With Machine Owners:</strong> Your name and farm location are shared with the Owner <em>only after</em> a booking is confirmed.</li>
                  <li><strong>With Admin:</strong> For dispute resolution and commission verification.</li>
                  <li><strong>Legal Requirements:</strong> If required by law enforcement or government agricultural bodies.</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Payments */}
            <section className="flex gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#03a74f]">
                  <CreditCard size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Payment Security</h3>
                <p className="text-gray-600">
                  We use secure third-party payment gateways (Razorpay/Stripe). We <strong>do not store</strong> your full credit card or bank account details on our servers. All transaction data is encrypted.
                </p>
              </div>
            </section>

          </div>



        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;