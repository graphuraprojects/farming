import React, { useState, useEffect } from "react";
import {
  Camera,
  Mail,
  Phone,
  User,
  Edit2,
  Save,
  X,
  Loader,
} from "lucide-react";
import axios from "axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const defaultImage =
    "https://res.cloudinary.com/drq2a0262/image/upload/v1768924942/admission-files/1768924941678-account.png";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    profile_pic: {
      url: "",
    },
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`/api/users/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role || "",
          address: {
            street: userData.address?.street || "",
            city: userData.address?.city || "",
            state: userData.address?.state || "",
            zip: userData.address?.zip || "",
            country: userData.address?.country || "",
          },
          profile_pic: {
            url: userData.profile_pic?.url || "",
          },
        });
        setOriginalData(userData);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be under 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);

      if (formData.phone) {
        formDataToSend.append("phone", formData.phone);
      }

      const addressData = {
        street: formData.address.street || "",
        city: formData.address.city || "",
        state: formData.address.state || "",
        zip: formData.address.zip || "",
        country: formData.address.country || "",
      };
      formDataToSend.append("address", JSON.stringify(addressData));

      if (selectedImage) {
        formDataToSend.append("profile_pic", selectedImage);
      }

      console.log("Sending data:", {
        name: formData.name,
        phone: formData.phone,
        address: addressData,
        hasImage: !!selectedImage,
      });

      const response = await axios.patch(`/api/users/profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        setImagePreview(null);
        setSelectedImage(null);
        await fetchProfile();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      console.error("Error response:", err.response?.data);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
    setSelectedImage(null);
    if (originalData) {
      setFormData({
        name: originalData.name || "",
        email: originalData.email || "",
        phone: originalData.phone || "",
        role: originalData.role || "",
        address: {
          street: originalData.address?.street || "",
          city: originalData.address?.city || "",
          state: originalData.address?.state || "",
          zip: originalData.address?.zip || "",
          country: originalData.address?.country || "",
        },
        profile_pic: {
          url: originalData.profile_pic?.url || "",
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e9fbf1cc] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#03a74f] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e9fbf1cc] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-[#03a74f] text-white rounded-lg hover:bg-[#028a42] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e9fbf1cc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative h-32 sm:h-40 bg-green-900">
            <div className="absolute -bottom-16 left-6 sm:left-8">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  <img
                    src={
                      imagePreview || formData.profile_pic?.url || defaultImage
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-[#03a74f] hover:bg-[#028a42] rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 sm:pt-24 px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {formData.name}
                </h1>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#03a74f] hover:bg-[#028a42] text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#03a74f] hover:bg-[#028a42] text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} className="text-gray-500" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                        required
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.name || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail size={16} className="text-gray-500" />
                      Email Address
                    </label>
                    <p className="text-gray-600 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
                      {formData.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone size={16} className="text-gray-500" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Address Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.address.street || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.address.city || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      State
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.address.state || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.zip"
                        value={formData.address.zip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.address.zip || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.address.country || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
