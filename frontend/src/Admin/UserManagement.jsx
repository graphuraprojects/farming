import React, { useState } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Loader,
  X,
  Ban,
  Unlock,
} from "lucide-react";
import axios from "axios";
import { color, shadow, gradientBg } from "../theme";

const UserManagement = () => {
  const [searchId, setSearchId] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Please enter a user ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUser(null);

      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/users/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err.response?.data?.message || "User not found. Please check the ID.",
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!user) return;

    const confirmBlock = window.confirm(
      `Are you sure you want to block user "${user.name}"? They will not be able to login.`,
    );

    if (!confirmBlock) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `/api/users/${user._id}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        alert("User blocked successfully!");
        // Update the user state to reflect the change
        setUser({ ...user, isBlocked: true });
      }
    } catch (err) {
      console.error("Block error:", err);
      alert(err.response?.data?.message || "Failed to block user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async () => {
    if (!user) return;

    const confirmUnblock = window.confirm(
      `Are you sure you want to unblock user "${user.name}"? They will be able to login again.`,
    );

    if (!confirmUnblock) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `/api/users/${user._id}/unblock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        alert("User unblocked successfully!");
        // Update the user state to reflect the change
        setUser({ ...user, isBlocked: false });
      }
    } catch (err) {
      console.error("Unblock error:", err);
      alert(err.response?.data?.message || "Failed to unblock user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setUser(null);
    setError("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return { background: "#fef2f2", color: color.danger, border: "#fecaca" };
      case "owner":
        return { background: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
      case "farmer":
        return { background: color.paleGreen, color: color.emerald, border: color.border };
      default:
        return { background: "#f3f4f6", color: color.textSoft, border: "#e5e7eb" };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: color.bg, minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: color.text }}>
            User Management
          </h1>
          <p style={{ color: color.textSoft }}>
            Search and manage users by their unique ID
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: color.textSoft }} />
              <input
                type="text"
                placeholder="Enter User ID (e.g., 507f1f77bcf86cd799439011)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ border: `1.5px solid ${color.inputBorder}` }}
                onFocus={(e) => { e.target.style.borderColor = color.emerald; e.target.style.boxShadow = `0 0 0 3px ${color.emerald}15`; }}
                onBlur={(e) => { e.target.style.borderColor = color.inputBorder; e.target.style.boxShadow = "none"; }}
              />
              {searchId && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: color.textSoft }}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchId.trim()}
              className="px-6 py-3.5 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
              style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}20` }}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ background: "#fef2f2", border: `1px solid #fecaca` }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: color.danger }}>
                <span className="text-white text-xs">!</span>
              </div>
              <p className="text-sm" style={{ color: color.danger }}>{error}</p>
            </div>
          )}
        </div>

        {/* User Details Card */}
        {user && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: shadow.md, border: `1px solid ${color.border}` }}>
            {/* Header with Profile Picture */}
            <div className="p-6" style={{ background: `linear-gradient(135deg, ${color.deepForest}, ${color.forest})` }}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white/20 flex-shrink-0" style={{ boxShadow: shadow.md }}>
                  {user.profile_pic?.url ? (
                    <img
                      src={user.profile_pic.url}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10">
                      <User className="w-10 h-10 text-white/60" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {user.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const badgeStyle = getRoleBadgeColor(user.role);
                      return (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: badgeStyle.background, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}` }}
                        >
                          {user.role?.toUpperCase()}
                        </span>
                      );
                    })()}
                    {user.isVerified && (
                      <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {user.isBlocked && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ background: color.danger, color: "white" }}>
                        <Ban className="w-3 h-3" />
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Information Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#eff6ff" }}>
                    <Mail className="w-5 h-5" style={{ color: "#2563eb" }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold mb-1" style={{ color: color.textSoft }}>
                      Email Address
                    </p>
                    <p className="font-medium break-all text-sm" style={{ color: color.text }}>
                      {user.email}
                    </p>
                    {user.pendingEmail && (
                      <p className="text-xs mt-1" style={{ color: color.warn }}>
                        Pending: {user.pendingEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color.paleGreen }}>
                    <Phone className="w-5 h-5" style={{ color: color.emerald }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold mb-1" style={{ color: color.textSoft }}>
                      Phone Number
                    </p>
                    <p className="font-medium text-sm" style={{ color: color.text }}>
                      {user.phone || "Not provided"}
                    </p>
                    {user.pendingPhone && (
                      <p className="text-xs mt-1" style={{ color: color.warn }}>
                        Pending: {user.pendingPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* User ID */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#f3e8ff" }}>
                    <User className="w-5 h-5" style={{ color: "#9333ea" }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold mb-1" style={{ color: color.textSoft }}>
                      User ID
                    </p>
                    <p className="font-mono text-sm break-all" style={{ color: color.text }}>
                      {user._id}
                    </p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#eef2ff" }}>
                    <Calendar className="w-5 h-5" style={{ color: "#4f46e5" }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold mb-1" style={{ color: color.textSoft }}>
                      Member Since
                    </p>
                    <p className="font-medium text-sm" style={{ color: color.text }}>
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {user.address && (
                <div className="pt-6" style={{ borderTop: `1px solid ${color.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fff7ed" }}>
                      <MapPin className="w-5 h-5" style={{ color: "#ea580c" }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase font-semibold mb-2" style={{ color: color.textSoft }}>
                        Address
                      </p>
                      <div className="rounded-xl p-4 space-y-1" style={{ background: color.bg }}>
                        {user.address.street && (
                          <p className="text-sm" style={{ color: color.text }}>{user.address.street}</p>
                        )}
                        <p className="text-sm" style={{ color: color.text }}>
                          {[
                            user.address.city,
                            user.address.state,
                            user.address.zip,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {user.address.country && (
                          <p className="text-sm" style={{ color: color.text }}>
                            {user.address.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Block Status Alert */}
              {user.isBlocked && (
                <div className="pt-6 mt-6" style={{ borderTop: `1px solid ${color.border}` }}>
                  <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "#fef2f2", border: `1px solid #fecaca` }}>
                    <Ban className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: color.danger }} />
                    <div>
                      <p className="font-semibold" style={{ color: "#991b1b" }}>
                        User is currently blocked
                      </p>
                      <p className="text-sm mt-1" style={{ color: color.danger }}>
                        This user cannot login or access their account.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 mt-6" style={{ borderTop: `1px solid ${color.border}` }}>
                {user.isBlocked ? (
                  <button
                    onClick={handleUnblock}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}20` }}
                  >
                    {actionLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Unblocking User...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-5 h-5" />
                        Unblock User
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleBlock}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: color.danger }}
                  >
                    {actionLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Blocking User...
                      </>
                    ) : (
                      <>
                        <Ban className="w-5 h-5" />
                        Block User
                      </>
                    )}
                  </button>
                )}
                <p className="text-xs mt-2" style={{ color: color.textSoft }}>
                  {user.isBlocked
                    ? "⚠️ Unblocking will allow this user to login and access their account again."
                    : "⚠️ Blocking will prevent this user from logging in and accessing their account."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
