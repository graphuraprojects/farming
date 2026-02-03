import React, { useState, useEffect } from 'react';

const MachineApproval = () => {
  // --- STATE MANAGEMENT ---
  const [machineData, setMachineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  
  // Checklist State (Dynamic)
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Photos are clear and show all angles", checked: true },
    { id: 2, label: "RC Book matches Chassis Number", checked: true },
    { id: 3, label: "Insurance is valid and active", checked: false },
    { id: 4, label: "Rental pricing within market range", checked: false },
  ]);

  // --- SIMULATE API CALL ---
  useEffect(() => {
    // In a real app, use: axios.get(`/api/admin/approvals/${id}`)
    const fetchMachineDetails = async () => {
      setLoading(true);
      setTimeout(() => {
        setMachineData({
          id: "MCH-2938",
          name: "John Deere 5310",
          type: "Utility Tractor",
          hp: "55HP",
          submittedDate: "Oct 24, 2023",
          status: "Pending Review",
          specs: {
            horsepower: "55 HP",
            fuelType: "Diesel",
            driveType: "4WD",
            usage: "2,500 Hours",
            makeYear: "2021",
            modelNo: "JD-5310-V2",
            transmission: "Synchromesh",
            liftingCapacity: "1600 kgf"
          },
          images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToH7N1wJRGNsSap60JVY5A3dqXh28HAsB1YA&s", // Main
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXpEgTHl_Y7ORFsUnbCX9rEYi3jpUbyy6iCw&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJw5gftbI-dBLWLhZe_NlPNjlT5mzUEmmV2g&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNZTI9irApy2YCtdjAoMhUUvvaQWx3JWCtCQ&s",
        ],
          documents: [
            { name: "Registration Certificate", size: "2.4 MB", info: "Uploaded Oct 24", icon: "picture_as_pdf", color: "text-red-500", bg: "bg-red-50" },
            { name: "Insurance Policy", size: "1.1 MB", info: "Valid till 2024", icon: "description", color: "text-blue-500", bg: "bg-blue-50" },
            { name: "Pollution Cert (PUC)", size: "JPG Image", info: "Verified", icon: "image", color: "text-yellow-600", bg: "bg-yellow-50" },
          ],
          pricing: {
            daily: 45,
            weekly: 250,
            securityDeposit: 200
          },
          owner: {
            name: "Rajesh Kumar",
            location: "Punjab, IN",
            rating: "4.8/5.0",
            verified: true,
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          }
        });
        setLoading(false);
      }, 500);
    };

    fetchMachineDetails();
  }, []);

  // --- HANDLERS ---
  const handleChecklistToggle = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAction = (action) => {
    alert(`${action} action triggered for machine ${machineData.id}\nNotes: ${adminNotes}`);
    // Here you would call your backend API to update status
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#03a74f]">Loading Review Details...</div>;

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#2b2b2b] font-['Inter',sans-serif] pb-12">
      
      {/* BREADCRUMBS */}
      <div className="px-4 md:px-8 lg:px-12 xl:px-40 pt-8 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#5b6e58]">
          <span className="cursor-pointer hover:text-[#03a74f]">Dashboard</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="cursor-pointer hover:text-[#03a74f]">Pending Approvals</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-semibold text-[#2b2b2b]">{machineData.name}</span>
        </div>
      </div>

      <main className="px-4 md:px-8 lg:px-12 xl:px-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: DOSSIER (8 Cols) --- */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1f3d2b]">
                  {machineData.name}
                </h1>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded-full border border-amber-200">
                  {machineData.status}
                </span>
              </div>
              <p className="text-[#5b6e58] text-base">
                {machineData.hp} {machineData.type} • Submitted on {machineData.submittedDate} • ID: #{machineData.id}
              </p>
            </div>

            {/* Image Gallery Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 p-1 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-2 aspect-[16/9] md:aspect-[21/9]">
                {/* Main Image (Large) */}
                <div 
                  className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                  style={{ backgroundImage: `url('${machineData.images[0]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                
                {/* Thumbnails */}
                {machineData.images.slice(1, 4).map((img, idx) => (
                  <div key={idx} className="relative group cursor-pointer overflow-hidden rounded-lg h-32 md:h-auto bg-gray-100">
                     <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${img}')` }}></div>
                  </div>
                ))}
                
                {/* View More Placeholder */}
                <div className="relative cursor-pointer overflow-hidden rounded-lg flex items-center justify-center bg-gray-100 h-32 md:h-auto hover:bg-gray-200 transition-colors">
                  <span className="text-[#5b6e58] font-bold text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined">add_a_photo</span> +4
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-[#fafaf7] flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#1f3d2b]">Technical Specifications</h3>
                <button className="text-sm text-[#03a74f] hover:underline font-medium">Edit Specs</button>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                {Object.entries(machineData.specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <p className="text-[#5b6e58] text-xs uppercase font-semibold tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()} {/* CamelCase to Title Case */}
                    </p>
                    <p className="text-[#2b2b2b] font-medium flex items-center gap-2">
                       {/* Simple icon logic based on key could go here */}
                       {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents & Pricing Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Documents */}
              <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-[#fafaf7]">
                  <h3 className="font-bold text-lg text-[#1f3d2b]">Ownership Documents</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {machineData.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-lg ${doc.bg} flex items-center justify-center ${doc.color}`}>
                          <span className="material-symbols-outlined">{doc.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#2b2b2b]">{doc.name}</span>
                          <span className="text-xs text-gray-500">{doc.size} • {doc.info}</span>
                        </div>
                      </div>
                      <button className="text-sm font-semibold text-[#03a74f] hover:text-[#38864b]">View</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 bg-[#fafaf7]">
                  <h3 className="font-bold text-lg text-[#1f3d2b]">Rental Pricing</h3>
                </div>
                <div className="p-6 flex flex-col gap-5 flex-1">
                  <div className="flex justify-between items-baseline border-b border-dashed border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Daily Rate</span>
                    <span className="text-2xl font-bold text-[#2b2b2b]">${machineData.pricing.daily}<span className="text-sm text-gray-400 font-normal">/day</span></span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dashed border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Weekly Rate</span>
                    <span className="text-2xl font-bold text-[#2b2b2b]">${machineData.pricing.weekly}<span className="text-sm text-gray-400 font-normal">/week</span></span>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-1">
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">verified_user</span> Security Deposit
                    </span>
                    <span className="font-semibold text-[#2b2b2b]">${machineData.pricing.securityDeposit}.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Owner Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 p-6 relative overflow-hidden">
               {/* Decorative Background blob */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#03a74f]/10 rounded-bl-full -mr-4 -mt-4"></div>
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="size-16 rounded-full bg-gray-200 border-2 border-white shadow-sm bg-cover bg-center"
                    style={{ backgroundImage: `url('${machineData.owner.avatar}')` }}
                  ></div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2b2b2b]">{machineData.owner.name}</h3>
                    <div className="flex items-center gap-1 text-[#03a74f] text-sm font-medium">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Verified Owner</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm font-semibold flex items-center gap-1 text-[#2b2b2b]">
                      <span className="material-symbols-outlined text-gray-400 text-[16px]">location_on</span>
                      {machineData.owner.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Rating</p>
                    <p className="text-sm font-semibold flex items-center justify-end gap-1 text-amber-500">
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      {machineData.owner.rating}
                    </p>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="rounded-lg h-32 w-full bg-gray-100 overflow-hidden relative border border-gray-200">
                   <div className="absolute inset-0 bg-[url('https://mt1.google.com/vt/lyrs=m&x=13&y=13&z=5')] bg-cover opacity-60"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-red-500 text-4xl drop-shadow-md">location_on</span>
                   </div>
                </div>
                
                <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  View Full Profile
                </button>
              </div>
            </div>

            {/* Review Checklist & Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center size-8 rounded-full bg-[#03a74f]/10 text-[#03a74f]">
                  <span className="material-symbols-outlined text-[20px]">checklist</span>
                </span>
                <h3 className="font-bold text-lg text-[#1f3d2b]">Review Checklist</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                {checklist.map((item) => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => handleChecklistToggle(item.id)}
                      className="mt-1 rounded border-gray-300 text-[#03a74f] focus:ring-[#03a74f] size-5 cursor-pointer" 
                    />
                    <span className={`text-sm group-hover:text-[#111813] transition-colors ${item.checked ? 'text-[#111813]' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Admin Notes</label>
                <textarea 
                  className="w-full rounded-lg border-gray-300 text-sm focus:border-[#03a74f] focus:ring-[#03a74f] min-h-[80px]" 
                  placeholder="Add internal notes about this machine..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                
                {/* APPROVE BUTTON - THEME COLOR */}
                <button 
                  onClick={() => handleAction('APPROVE')}
                  className="w-full py-3 px-4 bg-[#03a74f] hover:bg-[#38864b] text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Approve Machine
                </button>

                {/* REQUEST CHANGES */}
                <button 
                  onClick={() => handleAction('REQUEST_CHANGE')}
                  className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-[#03a74f]/30 hover:bg-[#fafaf7] text-gray-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">edit_note</span>
                  Request Changes
                </button>

                {/* REJECT - Minimal */}
                <button 
                  onClick={() => handleAction('REJECT')}
                  className="w-full py-2 px-4 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-1"
                >
                  Reject Application
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default MachineApproval;