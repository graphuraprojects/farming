import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const MachineApproval = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [machineData, setMachineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [checklist, setChecklist] = useState([
    { id: 1, label: "Photos are clear and show all angles", checked: false },
    { id: 2, label: "Registration details are valid", checked: false },
    { id: 3, label: "Ownership proof provided", checked: false },
    { id: 4, label: "Rental pricing within market range", checked: false },
  ]);

  const API_BASE_URL = `/api`;

  useEffect(() => {
    fetchMachineDetails();
  }, [id]);

  const fetchMachineDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("Fetching machine details for ID:", id);
      console.log("Token:", token);

      const response = await fetch(`${API_BASE_URL}/machines/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch machine details");

      const result = await response.json();

      console.log("Response:", result); // ✅ moved here

      setMachineData(result.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching machine:", err);
      setError("Failed to load machine details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistToggle = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleAction = async (actionType) => {
    console.log("\n=========== MACHINE ACTION START ===========");
    console.log("Action Type:", actionType);
    console.log("Machine ID:", id);
    console.log("Admin Notes:", adminNotes);

    if (actionType === "reject") {
      const trimmedNotes = (adminNotes || "").trim();
      console.log("Trimmed Admin Notes:", trimmedNotes);

      if (!trimmedNotes) {
        alert("Please add rejection notes.");
        return;
      }
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        console.log("❌ Token missing");
        alert("Session expired");
        return;
      }

      const payload = {
        action: actionType,
        ...(actionType === "reject" && {
          rejection_reason: (adminNotes || "").trim(),
        }),
      };

      console.log("📦 Payload being sent:", payload);

      const response = await fetch(`${API_BASE_URL}/machines/${id}/approval`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("🌐 Response Status:", response.status);

      const result = await response.json().catch(() => ({}));
      console.log("📨 Response Data:", result);

      if (!response.ok) {
        console.log("❌ API returned failure");
        throw new Error(result?.message || "Action failed");
      }

      console.log("✅ Action Success");

      alert(`Machine ${actionType}d successfully`);
      navigate("/admin/dashboard");
    } catch (err) {
      console.log("🚨 FRONTEND ACTION ERROR");
      console.error(err);

      alert(err.message);
    } finally {
      console.log("=========== MACHINE ACTION END ===========\n");
      setSubmitting(false);
    }
  };

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
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + machineData.images.length) % machineData.images.length,
    );
  };

  const openDocViewer = (doc) => {
    setSelectedDoc(doc);
    setIsDocViewerOpen(true);
  };

  const closeDocViewer = () => {
    setIsDocViewerOpen(false);
    setSelectedDoc(null);
  };

  useEffect(() => {
    if (isLightboxOpen || isDocViewerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen, isDocViewerOpen]);

  const getStatusInfo = () => {
    if (machineData.rejection_reason) {
      return { label: "Rejected", color: "bg-red-100 text-red-800" };
    }
    if (machineData.isApproved) {
      return { label: "Approved", color: "bg-green-100 text-green-800" };
    }
    return { label: "Pending Review", color: "bg-amber-100 text-amber-800" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf7]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#03a74f] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading machine details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf7]">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-2 bg-[#03a74f] text-white rounded-lg hover:bg-[#028a42]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#2b2b2b] font-['Inter',sans-serif] pb-12 pt-8">
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden relative flex flex-col p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
              onClick={closeLightbox}
            >
              <span className="material-symbols-outlined text-xl font-bold">
                close
              </span>
            </button>
            <div className="relative w-full h-[60vh] md:h-[70vh] bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
              <button
                className="absolute left-4 z-10 p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-[#03a74f]"
                onClick={prevImage}
              >
                <span className="material-symbols-outlined text-2xl">
                  chevron_left
                </span>
              </button>
              <img
                src={machineData.images[currentImageIndex].url}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute right-4 z-10 p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-[#03a74f]"
                onClick={nextImage}
              >
                <span className="material-symbols-outlined text-2xl">
                  chevron_right
                </span>
              </button>
            </div>
            <div className="py-3 px-4 flex justify-between items-center bg-white">
              <span className="text-gray-500 font-medium text-sm">
                Image {currentImageIndex + 1} of {machineData.images.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {isDocViewerOpen && selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeDocViewer}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-[#1f3d2b]">
                Ownership Proof Document
              </h3>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                onClick={closeDocViewer}
              >
                <span className="material-symbols-outlined text-xl font-bold">
                  close
                </span>
              </button>
            </div>

            <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center overflow-auto">
              <div className="bg-white p-2 shadow-lg border border-gray-200 rounded-lg">
                <img
                  src={selectedDoc}
                  className="max-w-full max-h-[600px] object-contain"
                  alt="Ownership Proof"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="px-4 md:px-8 lg:px-12 xl:px-40">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#03a74f] font-medium"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1f3d2b]">
                  {machineData.machine_name}
                </h1>
                <span
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-[#5b6e58] text-base">
                {machineData.model} • {machineData.model_year} • Reg:{" "}
                {machineData.registration_no}
              </p>
            </div>

            {machineData.images && machineData.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 p-1 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-2">
                  <div
                    className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 h-64 md:h-auto"
                    onClick={() => openLightbox(0)}
                  >
                    <img
                      src={machineData.images[0].url}
                      className="w-full h-full object-cover"
                      alt="Main"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  {machineData.images.slice(1, 5).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group cursor-pointer overflow-hidden rounded-lg h-32 md:h-auto bg-gray-100"
                      onClick={() => openLightbox(idx + 1)}
                    >
                      <img
                        src={img.url}
                        className="w-full h-full object-cover"
                        alt={`Image ${idx + 2}`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-[#fafaf7]">
                <h3 className="font-bold text-lg text-[#1f3d2b]">
                  Technical Specifications
                </h3>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[#5b6e58] text-xs uppercase font-semibold mb-1">
                    Category
                  </p>
                  <p className="text-[#2b2b2b] font-medium">
                    {machineData.category}
                  </p>
                </div>
                <div>
                  <p className="text-[#5b6e58] text-xs uppercase font-semibold mb-1">
                    Fuel Type
                  </p>
                  <p className="text-[#2b2b2b] font-medium">
                    {machineData.fuel_type}
                  </p>
                </div>
                <div>
                  <p className="text-[#5b6e58] text-xs uppercase font-semibold mb-1">
                    Price Per Hour
                  </p>
                  <p className="text-[#2b2b2b] font-medium">
                    ₹{machineData.price_per_hour}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-[#fafaf7]">
                  <h3 className="font-bold text-lg text-[#1f3d2b]">
                    Ownership Document
                  </h3>
                </div>
                <div className="p-4">
                  {machineData.ownership_proof ? (
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                          <span className="material-symbols-outlined">
                            picture_as_pdf
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[#2b2b2b]">
                          Ownership Proof
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          openDocViewer(machineData.ownership_proof.url)
                        }
                        className="text-sm font-semibold text-[#03a74f] hover:text-[#38864b]"
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm p-4">
                      No document uploaded
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-[#fafaf7]">
                  <h3 className="font-bold text-lg text-[#1f3d2b]">Location</h3>
                </div>
                <div className="p-6">
                  {machineData.address ? (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        {machineData.address.street}
                      </p>
                      <p className="text-gray-700">
                        {machineData.address.city}, {machineData.address.state}{" "}
                        {machineData.address.zip}
                      </p>
                      <p className="text-gray-700">
                        {machineData.address.country}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No address provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2b2b2b]">
                      {machineData.owner_id?.name || "Unknown Owner"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {machineData.owner_id?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm font-semibold text-[#2b2b2b]">
                      {machineData.owner_id?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-sm font-semibold text-[#2b2b2b] capitalize">
                      {machineData.owner_id?.role || "owner"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Owner id: {machineData.owner_id?._id}
                </p>
              </div>
            </div>

            {machineData.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-red-800 mb-2">
                  Rejection Reason
                </h3>
                <p className="text-sm text-red-700">
                  {machineData.rejection_reason}
                </p>
              </div>
            )}

            {!machineData.isApproved && !machineData.rejection_reason && (
              <div className="bg-white rounded-xl shadow-sm border border-[#1f3d2b]/10 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#03a74f]">
                    checklist
                  </span>
                  <h3 className="font-bold text-lg text-[#1f3d2b]">
                    Review Checklist
                  </h3>
                </div>

                <div className="space-y-3 mb-6">
                  {checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleChecklistToggle(item.id)}
                        className="mt-1 rounded border-gray-300 text-[#03a74f] focus:ring-[#03a74f] size-5"
                      />
                      <span
                        className={`text-sm ${item.checked ? "text-[#111813]" : "text-gray-500"}`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Admin Notes{" "}
                    {!machineData.isApproved &&
                      !machineData.rejection_reason && (
                        <span className="text-red-500">*</span>
                      )}
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 text-sm focus:border-[#03a74f] focus:ring-[#03a74f] min-h-[80px] resize-none"
                    placeholder="Required for rejection..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleAction("approve")}
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-[#03a74f] hover:bg-[#38864b] text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
                        Approve Machine
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAction("reject")}
                    disabled={submitting}
                    className="w-full py-2 px-4 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MachineApproval;
