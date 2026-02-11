import React, { useState } from "react";
import { Search, User, Mail, Phone, MapPin, Calendar, Shield, Loader, X, Ban, Unlock } from "lucide-react";
import axios from "axios";

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
      const response = await axios.get(
        `http://localhost:5000/api/users/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err.response?.data?.message || "User not found. Please check the ID."
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!user) return;

    const confirmBlock = window.confirm(
      `Are you sure you want to block user "${user.name}"? They will not be able to login.`
    );

    if (!confirmBlock) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:5000/api/users/${user._id}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      `Are you sure you want to unblock user "${user.name}"? They will be able to login again.`
    );

    if (!confirmUnblock) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:5000/api/users/${user._id}/unblock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        return "bg-red-100 text-red-700 border-red-200";
      case "owner":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "farmer":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Search and manage users by their unique ID
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter User ID (e.g., 507f1f77bcf86cd799439011)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              {searchId && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchId.trim()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
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
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* User Details Card */}
        {user && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Header with Profile Picture */}
            <div className="bg-green-900 p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                  {user.profile_pic?.url ? (
                    <img
                      src={user.profile_pic.url}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {user.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role?.toUpperCase()}
                    </span>
                    {user.isVerified && (
                      <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {user.isBlocked && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
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
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Email Address
                    </p>
                    <p className="text-gray-900 font-medium break-all">
                      {user.email}
                    </p>
                    {user.pendingEmail && (
                      <p className="text-xs text-amber-600 mt-1">
                        Pending: {user.pendingEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Phone Number
                    </p>
                    <p className="text-gray-900 font-medium">
                      {user.phone || "Not provided"}
                    </p>
                    {user.pendingPhone && (
                      <p className="text-xs text-amber-600 mt-1">
                        Pending: {user.pendingPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* User ID */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      User ID
                    </p>
                    <p className="text-gray-900 font-mono text-sm break-all">
                      {user._id}
                    </p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Member Since
                    </p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {user.address && (
                <div className="border-t pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                        Address
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                        {user.address.street && (
                          <p className="text-gray-700">{user.address.street}</p>
                        )}
                        <p className="text-gray-700">
                          {[
                            user.address.city,
                            user.address.state,
                            user.address.zip,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {user.address.country && (
                          <p className="text-gray-700">{user.address.country}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Block Status Alert */}
              {user.isBlocked && (
                <div className="border-t pt-6 mt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">User is currently blocked</p>
                      <p className="text-sm text-red-700 mt-1">
                        This user cannot login or access their account.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-6 mt-6">
                {user.isBlocked ? (
                  <button
                    onClick={handleUnblock}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <p className="text-xs text-gray-500 mt-2">
                  {user.isBlocked 
                    ? "⚠️ Unblocking will allow this user to login and access their account again."
                    : "⚠️ Blocking will prevent this user from logging in and accessing their account."
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;