import React, { useState, useEffect } from 'react';

const MachineApproval = () => {
  // --- STATE MANAGEMENT ---
  const [machineData, setMachineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state for backend readiness
  const [adminNotes, setAdminNotes] = useState("");
  
  // Lightbox State (Images)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Document Viewer State (New)
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Photos are clear and show all angles", checked: true },
    { id: 2, label: "RC Book matches Chassis Number", checked: true },
    { id: 3, label: "Insurance is valid and active", checked: false },
    { id: 4, label: "Rental pricing within market range", checked: false },
  ]);

  // --- API INTEGRATION (FETCH DATA) ---
  useEffect(() => {
    
    // --- ADAPTER PATTERN / DATA MAPPER ---
    // Use this function to translate API field names to the names your UI expects.
    // Even if your API changes, you only update this function, not the whole UI.
    const mapApiDataToUI = (apiData) => {
        return {
            id: apiData.id || apiData.machine_id, 
            name: apiData.name || apiData.title,
            type: apiData.type,
            hp: apiData.hp,
            submittedDate: apiData.submittedDate || apiData.created_at, 
            status: apiData.status,
            specs: {
                horsepower: apiData.specs?.horsepower || apiData.specs?.hp_rating,
                fuelType: apiData.specs?.fuelType,
                driveType: apiData.specs?.driveType,
                usage: apiData.specs?.usage,
                makeYear: apiData.specs?.makeYear,
                modelNo: apiData.specs?.modelNo,
                transmission: apiData.specs?.transmission,
                liftingCapacity: apiData.specs?.liftingCapacity
            },
            images: apiData.images || [],
            documents: apiData.documents || [],
            pricing: apiData.pricing || { daily: 0, weekly: 0, securityDeposit: 0 },
            owner: apiData.owner || {}
        };
    };

    const fetchMachineDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // ============================================================
        // 1. BACKEND INTEGRATION: Uncomment below and add your API URL
        // ============================================================
        /*
        const machineId = "MCH-2938"; 
        const response = await fetch(`https://your-api.com/machines/${machineId}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const rawData = await response.json();
        setMachineData(mapApiDataToUI(rawData));
        */

        // ============================================================
        // 2. SIMULATED DATA (Delete this block when backend is ready)
        // ============================================================
        await new Promise(resolve => setTimeout(resolve, 400)); 
        
        const mockResponse = {
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
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToH7N1wJRGNsSap60JVY5A3dqXh28HAsB1YA&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXpEgTHl_Y7ORFsUnbCX9rEYi3jpUbyy6iCw&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJw5gftbI-dBLWLhZe_NlPNjlT5mzUEmmV2g&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNZTI9irApy2YCtdjAoMhUUvvaQWx3JWCtCQ&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXpEgTHl_Y7ORFsUnbCX9rEYi3jpUbyy6iCw&s"
          ],
          documents: [
            // Added previewUrl for the document viewer
            { 
                name: "Registration Certificate", 
                icon: "picture_as_pdf", 
                color: "text-red-500", 
                bg: "bg-red-50",
                previewUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXpEgTHl_Y7ORFsUnbCX9rEYi3jpUbyy6iCw&s" 
            },
            { 
                name: "Insurance Policy", 
                icon: "description", 
                color: "text-blue-500", 
                bg: "bg-blue-50",
                previewUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_uK1gGf4T-cCtW0b6jV-sO1bX6gD5fE8g9Q&s"
            },
            { 
                name: "Pollution Cert (PUC)", 
                icon: "image", 
                color: "text-yellow-600", 
                bg: "bg-yellow-50",
                previewUrl: "hhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_uK1gGf4T-cCtW0b6jV-sO1bX6gD5fE8g9Q&s"
            },
          ],
          pricing: {
            daily: 2500,
            weekly: 15000,
            securityDeposit: 5000
          },
          owner: {
            name: "Rajesh Kumar",
            location: "Punjab, IN",
            rating: "4.8/5.0",
            verified:true, // CHANGED TO FALSE TO SHOW DYNAMIC UI
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          }
        };
        
        setMachineData(mapApiDataToUI(mockResponse));
        // ============================================================

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load machine details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMachineDetails();
  }, []);

  // --- HANDLERS ---
  const handleChecklistToggle = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAction = async (actionType) => {
    // Basic validation
    if (actionType === 'REJECT' && !adminNotes) {
      alert("Please add notes explaining why the machine is being rejected.");
      return;
    }

    try {
      // ============================================================
      // BACKEND INTEGRATION: Uncomment below
      // ============================================================
      /*
      const payload = {
        status: actionType, // 'APPROVE' or 'REJECT'
        adminNotes: adminNotes,
        checklistData: checklist
      };

      const response = await fetch(`https://your-api.com/machines/${machineData.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
         alert("Status updated successfully!");
         // Redirect or refresh
      }
      */

      // ============================================================
      // SIMULATION
      // ============================================================
      alert(`${actionType} action triggered for machine ${machineData.id}\nNotes: ${adminNotes}`);

    } catch (err) {
      alert("Something went wrong while submitting.");
    }
  };

  // --- LIGHTBOX HANDLERS (IMAGES) ---
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % machineData.images.length);
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + machineData.images.length) % machineData.images.length);
  };

  // --- DOCUMENT VIEWER HANDLERS (DOCS) ---
  const openDocViewer = (doc) => {
    setSelectedDoc(doc);
    setIsDocViewerOpen(true);
  };
  const closeDocViewer = () => {
    setIsDocViewerOpen(false);
    setSelectedDoc(null);
  };

  // Effect to lock body scroll when any modal is open
  useEffect(() => {
    if (isLightboxOpen || isDocViewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen, isDocViewerOpen]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#03a74f]">Loading Review Details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#2b2b2b] font-['Inter',sans-serif] pb-12 pt-8">
      
      {/* Navigation removed as requested */}

      {/* --- IMAGE LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
            onClick={closeLightbox}
        >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden relative flex flex-col p-2"
              onClick={(e) => e.stopPropagation()}
            >
                <button className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all" onClick={closeLightbox}>
                    <span className="material-symbols-outlined text-xl font-bold">close</span>
                </button>
                <div className="relative w-full h-[60vh] md:h-[70vh] bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <button className="absolute left-4 z-10 p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-[#03a74f] hover:scale-110 transition-all" onClick={prevImage}>
                        <span className="material-symbols-outlined text-2xl">chevron_left</span>
                    </button>
                    <img src={machineData.images[currentImageIndex]} alt="Preview" className="max-w-full max-h-full object-contain select-none"/>
                    <button className="absolute right-4 z-10 p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-[#03a74f] hover:scale-110 transition-all" onClick={nextImage}>
                        <span className="material-symbols-outlined text-2xl">chevron_right</span>
                    </button>
                </div>
                <div className="py-3 px-4 flex justify-between items-center bg-white">
                    <span className="text-gray-500 font-medium text-sm">Image {currentImageIndex + 1} of {machineData.images.length}</span>
                    <div className="flex gap-2 overflow-x-auto">
                      {machineData.images.map((img, idx) => (
                        <div key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentImageIndex === idx ? 'border-[#03a74f] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- DOCUMENT VIEWER MODAL (NO FOOTER BUTTONS) --- */}
      {isDocViewerOpen && selectedDoc && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
            onClick={closeDocViewer}
        >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-lg ${selectedDoc.bg} flex items-center justify-center ${selectedDoc.color}`}>
                            <span className="material-symbols-outlined">{selectedDoc.icon}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1f3d2b]">{selectedDoc.name}</h3>
                        </div>
                    </div>
                    <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all" onClick={closeDocViewer}>
                        <span className="material-symbols-outlined text-xl font-bold">close</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center overflow-auto">
                    <div className="bg-white p-2 shadow-lg border border-gray-200 rounded-lg">
                        <div className="w-[300px] md:w-[500px] h-[400px] md:h-[600px] bg-gray-100 flex items-center justify-center text-gray-400 flex-col gap-4 overflow-hidden relative">
                             {/* Displaying dummy image as document preview */}
                             <img src={selectedDoc.previewUrl} className="w-full h-full object-contain " alt="Doc Preview" />
                             
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      <main className="px-4 md:px-8 lg:px-12 xl:px-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: DOSSIER (8 Cols) --- */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Header (Back inside Left Column) */}
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
                <div 
                  className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                  style={{ backgroundImage: `url('${machineData.images[0]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  onClick={() => openLightbox(0)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                     <span className="material-symbols-outlined text-sm">fullscreen</span> View
                  </div>
                </div>
                {machineData.images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="relative group cursor-pointer overflow-hidden rounded-lg h-32 md:h-auto bg-gray-100" onClick={() => openLightbox(idx + 1)}>
                      <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${img}')` }}></div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-[#fafaf7] flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#1f3d2b]">Technical Specifications</h3>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                {Object.entries(machineData.specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <p className="text-[#5b6e58] text-xs uppercase font-semibold tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-[#2b2b2b] font-medium flex items-center gap-2">
                        {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents & Pricing Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Documents - Updated to Open Viewer & Remove Info */}
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
                          {/* REMOVED: Size and Info Text */}
                        </div>
                      </div>
                      <button 
                        onClick={() => openDocViewer(doc)}
                        className="text-sm font-semibold text-[#03a74f] hover:text-[#38864b]"
                      >
                        View
                      </button>
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
                    <span className="font-bold text-[#2b2b2b]">₹{machineData.pricing.daily}<span className="text-sm text-gray-400 font-normal">/day</span></span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dashed border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Weekly Rate</span>
                    <span className="font-bold text-[#2b2b2b]">₹{machineData.pricing.weekly}<span className="text-sm text-gray-400 font-normal">/week</span></span>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-1">
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">verified_user</span> Security Deposit
                    </span>
                    <span className="font-semibold text-[#2b2b2b]">₹{machineData.pricing.securityDeposit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Owner Profile - Updated Verification Logic */}
            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#03a74f]/10 rounded-bl-full -mr-4 -mt-4"></div>
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="size-16 rounded-full bg-gray-200 border-2 border-white shadow-sm bg-cover bg-center"
                    style={{ backgroundImage: `url('${machineData.owner.avatar}')` }}
                  ></div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2b2b2b]">{machineData.owner.name}</h3>
                    
                    {/* CONDITIONAL VERIFICATION BADGE */}
                    {machineData.owner.verified ? (
                        <div className="flex items-center gap-1 text-[#03a74f] text-sm font-medium">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                            <span>Verified Owner</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-gray-500 text-sm font-medium bg-gray-100 px-2 py-0.5 rounded-md w-fit mt-1">
                            <span className="material-symbols-outlined text-[16px]">gpp_bad</span>
                            <span>Unverified</span>
                        </div>
                    )}

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
                  className="w-full rounded-lg border border-gray-200 text-sm focus:border-[#03a74f] focus:ring-[#03a74f] min-h-[80px] resize-none" 
                  placeholder="Add internal notes about this machine..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleAction('APPROVE')}
                  className="w-full py-3 px-4 bg-[#03a74f] hover:bg-[#38864b] text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Approve Machine
                </button>
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