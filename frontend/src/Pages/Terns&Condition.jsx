import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Scale, 
  Truck, 
  AlertTriangle, 
  FileText, 
  CheckCircle,
  Clock,
  Banknote,
  Ban,
  Mail
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

            {/* NEW SECTION 6: Account Blocking Policy */}
            <section>
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <span className="bg-[#fff3e0] text-orange-600 p-2 rounded-lg mr-3">
                  <Ban size={24} />
                </span>
                6. Account Suspension & Blocking Policy
              </h2>
              <div className="pl-4 border-l-2 border-orange-200 ml-4 space-y-4 text-gray-600">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="font-semibold text-orange-900 mb-2">⚠️ Warning: Violation of Platform Guidelines</p>
                  <p className="text-sm">The platform reserves the right to suspend or permanently block user accounts that violate our terms of service.</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-lg">Grounds for Account Blocking:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Spam Machine Submissions:</strong> Submitting multiple machine listings with invalid, incomplete, or fraudulent information.
                    </li>
                    <li>
                      <strong>Fake Documentation:</strong> Providing forged or manipulated ownership documents, registration certificates, or insurance papers.
                    </li>
                    <li>
                      <strong>Repeated Rejections:</strong> Having more than <span className="text-red-600 font-bold">3 machine approval requests rejected</span> within a 30-day period due to invalid details.
                    </li>
                    <li>
                      <strong>Identity Fraud:</strong> Creating multiple accounts or impersonating another individual or organization.
                    </li>
                    <li>
                      <strong>Payment Fraud:</strong> Attempting to manipulate payment systems, chargebacks, or providing false payment information.
                    </li>
                    <li>
                      <strong>Violation of Usage Terms:</strong> Repeated cancellations without valid reason, abuse of platform features, or harassment of other users.
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <Ban size={20} />
                    Consequences of Account Blocking
                  </h4>
                  <ul className="text-sm space-y-1 text-red-800">
                    <li>• Immediate suspension of all platform access</li>
                    <li>• Removal of all active machine listings</li>
                    <li>• Forfeiture of pending earnings (in case of severe violations)</li>
                    <li>• Inability to create new bookings or accept rental requests</li>
                    <li>• Potential legal action for fraudulent activities</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-4">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Mail size={20} />
                    Account Unblock Process
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    If your account has been blocked and you believe it was done in error, or you wish to appeal the decision, follow these steps:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Visit Contact Support</p>
                        <p className="text-sm text-gray-600">Navigate to the <strong>Contact Us</strong> page on our platform.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Provide Your User ID</p>
                        <p className="text-sm text-gray-600">
                          Include your <strong className="text-red-600">User ID (Owner ID)</strong> in the message. 
                          You can find this in your profile settings or in the account blocked notification email.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Explain Your Situation</p>
                        <p className="text-sm text-gray-600">
                          Clearly describe why you believe your account should be unblocked. Include any supporting documents or evidence if applicable.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Wait for Review</p>
                        <p className="text-sm text-gray-600">
                          Our support team will review your request within <strong>3-5 business days</strong> and respond via email with the final decision.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                    <p className="text-xs text-gray-600">
                      <strong>Important:</strong> Unblock requests will only be considered if the violation was unintentional or if corrective documentation is provided. 
                      Repeated violations will result in permanent account termination.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle size={20} />
                    How to Avoid Account Blocking
                  </h4>
                  <ul className="text-sm space-y-1 text-green-800">
                    <li>✓ Always provide accurate and complete machine information</li>
                    <li>✓ Upload clear, valid ownership and registration documents</li>
                    <li>✓ Ensure all submitted images are recent and genuine</li>
                    <li>✓ Respond promptly to admin requests for additional verification</li>
                    <li>✓ Follow all platform guidelines and community standards</li>
                  </ul>
                </div>
              </div>
            </section>

          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;