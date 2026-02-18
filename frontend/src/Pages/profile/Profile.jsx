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
    addresses: [],
    profile_pic: {
      url: "",
    },
  });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [originalData, setOriginalData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({
    latitude: null,
    longitude: null,
  });

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
          addresses: userData.addresses || [],
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
      const field = name.split(".")[1];

      setFormData((prev) => {
        const updatedAddresses = [...prev.addresses];
        updatedAddresses[selectedAddressIndex] = {
          ...updatedAddresses[selectedAddressIndex],
          [field]: value,
        };

        return {
          ...prev,
          addresses: updatedAddresses,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCoords({
          latitude,
          longitude,
        });

        console.log("Lat:", latitude);
        console.log("Lng:", longitude);

        try {
          // Reverse geocoding using OpenStreetMap
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
              },
            },
          );

          const address = res.data.address;

          setFormData((prev) => {
            const updatedAddresses = [...prev.addresses];

            updatedAddresses[selectedAddressIndex] = {
              ...updatedAddresses[selectedAddressIndex],
              street:
                address.road ||
                address.residential ||
                address.neighbourhood ||
                address.suburb ||
                address.hamlet ||
                address.pedestrian ||
                res.data.display_name ||
                "",

              city:
                address.city ||
                address.town ||
                address.village ||
                address.county ||
                "",
              state: address.state || "",
              zip: address.postcode || "",
              country: address.country || "",
            };

            return {
              ...prev,
              addresses: updatedAddresses,
            };
          });

          alert("Location detected successfully!");
        } catch (error) {
          console.error("Reverse geocode error:", error);
          alert("Failed to fetch address");
        }
      },
      (error) => {
        alert("Location permission denied or unavailable");
      },
    );
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

      if (selectedImage) {
        formDataToSend.append("profile_pic", selectedImage);
      }

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

        await fetchProfile(); // refresh data
      }
    } catch (err) {
      console.error("Error updating profile:", err);
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
        addresses: originalData.addresses || [],
        profile_pic: {
          url: originalData.profile_pic?.url || "",
        },
      });

      setSelectedAddressIndex(0);
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
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      📍 Use My Current Location
                    </button>
                  )}
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
                {formData.addresses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.addresses.map((addr, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAddressIndex(index)}
                        className={`px-4 py-1 rounded-full text-sm font-medium border ${
                          index === selectedAddressIndex
                            ? "bg-[#03a74f] text-white border-[#03a74f]"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {addr.label || `Address ${index + 1}`}
                        {addr.isDefault && " ⭐"}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.street"
                        value={formData.addresses[selectedAddressIndex]?.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.addresses[selectedAddressIndex]?.street ||
                          "Not provided"}
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
                        value={formData.addresses[selectedAddressIndex]?.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.addresses[selectedAddressIndex]?.city ||
                          "Not provided"}
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
                        value={
                          formData.addresses[selectedAddressIndex]?.state || ""
                        }
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.addresses[selectedAddressIndex]?.state ||
                          "" ||
                          "Not provided"}
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
                        value={
                          formData.addresses[selectedAddressIndex]?.zip || ""
                        }
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.addresses[selectedAddressIndex]?.zip ||
                          "" ||
                          "Not provided"}
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
                        value={
                          formData.addresses[selectedAddressIndex]?.country ||
                          ""
                        }
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-4 py-3 bg-white rounded-lg border border-gray-200">
                        {formData.addresses[selectedAddressIndex]?.country ||
                          "" ||
                          "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        addresses: [
                          ...prev.addresses,
                          {
                            label: `Address ${prev.addresses.length + 1}`,
                            street: "",
                            city: "",
                            state: "",
                            zip: "",
                            country: "",
                            isDefault: false,
                          },
                        ],
                      }));
                      setSelectedAddressIndex(formData.addresses.length);
                    }}
                    className="mt-4 px-4 py-2 bg-[#03a74f] text-white rounded-lg hover:bg-[#028a42] transition"
                  >
                    + Add New Address
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
