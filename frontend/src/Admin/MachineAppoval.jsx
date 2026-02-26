import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { color, shadow, gradientBg } from "../theme";

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
      return { label: "Rejected", bgColor: "#fef2f2", textColor: color.danger };
    }
    if (machineData.isApproved) {
      return { label: "Approved", bgColor: color.paleGreen, textColor: color.emerald };
    }
    return { label: "Pending Review", bgColor: "#fffbeb", textColor: "#b45309" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: color.bg }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: color.paleGreen, borderTopColor: color.emerald }} />
          <p className="font-medium text-sm" style={{ color: color.textSoft }}>
            Loading machine details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: color.bg }}>
        <div className="text-center bg-white p-8 rounded-2xl" style={{ boxShadow: shadow.md, border: `1px solid ${color.border}` }}>
          <p className="font-medium mb-4" style={{ color: color.danger }}>{error}</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-2.5 text-white rounded-xl font-semibold transition-all duration-200"
            style={{ background: gradientBg(color.emerald, color.forest) }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen font-['Inter',sans-serif] pb-12 pt-8" style={{ background: color.bg, color: color.text }}>
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden relative flex flex-col p-2"
            style={{ boxShadow: shadow.xl }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full transition-colors"
              style={{ background: color.bg }}
              onClick={closeLightbox}
            >
              <span className="material-symbols-outlined text-xl font-bold" style={{ color: color.textSoft }}>
                close
              </span>
            </button>
            <div className="relative w-full h-[60vh] md:h-[70vh] rounded-xl flex items-center justify-center overflow-hidden" style={{ background: color.bg }}>
              <button
                className="absolute left-4 z-10 p-3 rounded-full bg-white transition-colors"
                style={{ boxShadow: shadow.md }}
                onClick={prevImage}
              >
                <span className="material-symbols-outlined text-2xl" style={{ color: color.text }}>
                  chevron_left
                </span>
              </button>
              <img
                src={machineData.images[currentImageIndex].url}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute right-4 z-10 p-3 rounded-full bg-white transition-colors"
                style={{ boxShadow: shadow.md }}
                onClick={nextImage}
              >
                <span className="material-symbols-outlined text-2xl" style={{ color: color.text }}>
                  chevron_right
                </span>
              </button>
            </div>
            <div className="py-3 px-4 flex justify-between items-center bg-white">
              <span className="font-medium text-sm" style={{ color: color.textSoft }}>
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
            className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] overflow-hidden relative flex flex-col"
            style={{ boxShadow: shadow.xl }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 flex justify-between items-center bg-white" style={{ borderBottom: `1px solid ${color.border}` }}>
              <h3 className="font-bold" style={{ color: color.forest }}>
                Ownership Proof Document
              </h3>
              <button
                className="p-2 rounded-full transition-colors"
                style={{ background: color.bg }}
                onClick={closeDocViewer}
              >
                <span className="material-symbols-outlined text-xl font-bold" style={{ color: color.textSoft }}>
                  close
                </span>
              </button>
            </div>

            <div className="flex-1 p-6 flex items-center justify-center overflow-auto" style={{ background: color.bg }}>
              <div className="bg-white p-2 rounded-xl" style={{ boxShadow: shadow.md, border: `1px solid ${color.border}` }}>
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
            className="flex items-center gap-2 font-medium text-sm transition-colors"
            style={{ color: color.textSoft }}
            onMouseEnter={(e) => e.currentTarget.style.color = color.emerald}
            onMouseLeave={(e) => e.currentTarget.style.color = color.textSoft}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2 pb-4" style={{ borderBottom: `1px solid ${color.border}` }}>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: color.forest }}>
                  {machineData.machine_name}
                </h1>
                <span
                  className="px-3 py-1 text-xs font-bold uppercase rounded-full"
                  style={{ background: statusInfo.bgColor, color: statusInfo.textColor }}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm" style={{ color: color.textSoft }}>
                {machineData.model} • {machineData.model_year} • Reg:{" "}
                {machineData.registration_no}
              </p>
            </div>

            {machineData.images && machineData.images.length > 0 && (
              <div className="bg-white rounded-2xl p-1 overflow-hidden" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-2">
                  <div
                    className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-xl h-64 md:h-auto"
                    style={{ background: color.bg }}
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
                      className="relative group cursor-pointer overflow-hidden rounded-xl h-32 md:h-auto"
                      style={{ background: color.bg }}
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

            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${color.border}`, background: color.bg }}>
                <h3 className="font-bold text-base" style={{ color: color.forest }}>
                  Technical Specifications
                </h3>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs uppercase font-semibold mb-1" style={{ color: color.textSoft }}>
                    Category
                  </p>
                  <p className="font-medium text-sm" style={{ color: color.text }}>
                    {machineData.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold mb-1" style={{ color: color.textSoft }}>
                    Fuel Type
                  </p>
                  <p className="font-medium text-sm" style={{ color: color.text }}>
                    {machineData.fuel_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold mb-1" style={{ color: color.textSoft }}>
                    Price Per Day
                  </p>
                  <p className="font-bold text-sm" style={{ color: color.warmGold }}>
                    ₹{machineData.price_per_day}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid ${color.border}`, background: color.bg }}>
                  <h3 className="font-bold text-base" style={{ color: color.forest }}>
                    Ownership Document
                  </h3>
                </div>
                <div className="p-4">
                  {machineData.ownership_proof ? (
                    <div className="flex items-center justify-between p-4 rounded-xl transition-colors" style={{ border: `1px solid ${color.border}` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                          <span className="material-symbols-outlined">
                            picture_as_pdf
                          </span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: color.text }}>
                          Ownership Proof
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          openDocViewer(machineData.ownership_proof.url)
                        }
                        className="text-sm font-semibold transition-colors"
                        style={{ color: color.emerald }}
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm p-4" style={{ color: color.textSoft }}>
                      No document uploaded
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid ${color.border}`, background: color.bg }}>
                  <h3 className="font-bold text-base" style={{ color: color.forest }}>Location</h3>
                </div>
                <div className="p-6">
                  {machineData.address ? (
                    <div className="space-y-2 text-sm">
                      <p style={{ color: color.text }}>
                        {machineData.address.street}
                      </p>
                      <p style={{ color: color.text }}>
                        {machineData.address.city}, {machineData.address.state}{" "}
                        {machineData.address.zip}
                      </p>
                      <p style={{ color: color.text }}>
                        {machineData.address.country}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: color.textSoft }}>No address provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl" style={{ background: color.bg, border: `1px solid ${color.border}` }}>
                    👤
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: color.text }}>
                      {machineData.owner_id?.name || "Unknown Owner"}
                    </h3>
                    <p className="text-sm" style={{ color: color.textSoft }}>
                      {machineData.owner_id?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4" style={{ borderTop: `1px solid ${color.border}` }}>
                  <div>
                    <p className="text-xs mb-1" style={{ color: color.textSoft }}>Phone</p>
                    <p className="text-sm font-semibold" style={{ color: color.text }}>
                      {machineData.owner_id?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: color.textSoft }}>Role</p>
                    <p className="text-sm font-semibold capitalize" style={{ color: color.text }}>
                      {machineData.owner_id?.role || "owner"}
                    </p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: color.textSoft }}>
                  Owner id: {machineData.owner_id?._id}
                </p>
              </div>
            </div>

            {machineData.rejection_reason && (
              <div className="rounded-2xl p-6" style={{ background: "#fef2f2", border: `1px solid #fecaca` }}>
                <h3 className="font-bold mb-2" style={{ color: "#991b1b" }}>
                  Rejection Reason
                </h3>
                <p className="text-sm" style={{ color: color.danger }}>
                  {machineData.rejection_reason}
                </p>
              </div>
            )}

            {!machineData.isApproved && !machineData.rejection_reason && (
              <div className="bg-white rounded-2xl p-6 sticky top-24" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined" style={{ color: color.emerald }}>
                    checklist
                  </span>
                  <h3 className="font-bold text-base" style={{ color: color.forest }}>
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
                        className="mt-1 rounded size-5"
                        style={{ accentColor: color.emerald }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: item.checked ? color.text : color.textSoft }}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase mb-2" style={{ color: color.textSoft }}>
                    Admin Notes{" "}
                    {!machineData.isApproved &&
                      !machineData.rejection_reason && (
                        <span style={{ color: color.danger }}>*</span>
                      )}
                  </label>
                  <textarea
                    className="w-full rounded-xl text-sm min-h-[80px] resize-none px-3 py-2 outline-none transition-all duration-200"
                    placeholder="Required for rejection..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    style={{ border: `1.5px solid ${color.inputBorder}` }}
                    onFocus={(e) => e.target.style.borderColor = color.emerald}
                    onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-3 pt-4" style={{ borderTop: `1px solid ${color.border}` }}>
                  <button
                    onClick={() => handleAction("approve")}
                    disabled={submitting}
                    className="w-full py-3 px-4 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}25` }}
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
                    className="w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: color.danger }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
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
