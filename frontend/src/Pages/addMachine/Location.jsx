import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapPin, Upload, FileText, Check, Trash2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Location = ({ data, setData, prev, submit }) => {
  const [location, setLocation] = useState({
    lat: data.lat || null,
    lng: data.lng || null,
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    zipCode: data.zipCode || "",
    country: data.country || "",
  });

  const [uploadedFile, setUploadedFile] = useState(data.document || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!data.lat || !data.lng) {
      getCurrentLocation();
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      lat: location.lat,
      lng: location.lng,
      address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      country: location.country,
    }));
  }, [location]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      document: uploadedFile,
    }));
  }, [uploadedFile]);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        updateLocationFromCoords(lat, lng);
      },
    });

    if (!location.lat || !location.lng) return null;

    return (
      <Marker
        position={[location.lat, location.lng]}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            updateLocationFromCoords(position.lat, position.lng);
          },
        }}
        icon={greenIcon}
      />
    );
  };

  const updateLocationFromCoords = async (lat, lng) => {
    setLocation((prev) => ({ ...prev, lat, lng }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();

      if (data && data.address) {
        setLocation((prev) => ({
          ...prev,
          lat,
          lng,
          address: data.address.road || data.address.suburb || "",
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          zipCode: data.address.postcode || "",
          country: data.address.country || "",
        }));
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocationFromCoords(lat, lng);
          setIsLoadingLocation(false);

          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 13);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          alert(
            "Unable to get your location. Please ensure location services are enabled.",
          );
        },
      );
    } else {
      setIsLoadingLocation(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
    } else {
      alert("Please upload an image file (JPG, PNG, JPEG)");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    // if (!location.lat || !location.lng) {
    //   alert("Please select a location on the map");
    //   return;
    // }

    if (
      !location.address ||
      !location.city ||
      !location.state ||
      !location.country
    ) {
      alert("Please fill all address fields");
      return;
    }

    if (!uploadedFile) {
      alert("Please upload ownership proof document");
      return;
    }

    submit();
  };


return (
  <div className="min-h-screen flex justify-center px-2 sm:px-4 py-8">
    
    <div className="w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Location & Documents
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Set your machine location and upload ownership documents
        </p>
      </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Base Location
              </h2>
              <button
                onClick={getCurrentLocation}
                className="text-sm text-[#03a74f] hover:text-[#028a42] font-semibold transition-colors"
              >
                Use current location
              </button>
            </div>

            <div className="relative z-0">
              {isLoadingLocation ? (
                <div className="w-full h-80 rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#03a74f] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600 font-medium">
                      Getting your location...
                    </p>
                  </div>
                </div>
              ) : location.lat && location.lng ? (
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={13}
                  ref={mapRef}
                  style={{
                    height: "320px",
                    width: "100%",
                    borderRadius: "12px",
                    zIndex: 0,
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                </MapContainer>
              ) : (
                <div className="w-full h-80 rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      Location not available
                    </p>
                    <button
                      onClick={getCurrentLocation}
                      className="text-sm text-[#03a74f] hover:text-[#028a42] font-semibold"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Click on the map or drag the marker to set your exact location
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Address Details
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Street Address
                </label>
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) =>
                    setLocation({ ...location, address: e.target.value })
                  }
                  className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 text-sm">
                    City
                  </label>
                  <input
                    type="text"
                    value={location.city}
                    onChange={(e) =>
                      setLocation({ ...location, city: e.target.value })
                    }
                    className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                    placeholder="Enter city"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 text-sm">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={location.state}
                    onChange={(e) =>
                      setLocation({ ...location, state: e.target.value })
                    }
                    className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 text-sm">
                    Zip / Postal Code
                  </label>
                  <input
                    type="text"
                    value={location.zipCode}
                    onChange={(e) =>
                      setLocation({ ...location, zipCode: e.target.value })
                    }
                    className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                    placeholder="Enter zip code"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 text-sm">
                    Country
                  </label>
                  <select
                    value={location.country}
                    onChange={(e) =>
                      setLocation({ ...location, country: e.target.value })
                    }
                    className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  >
                    <option value="">Select Country</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>India</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ownership Verification
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Upload documents to verify legal ownership. Required for insurance
              coverage
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 transition-all ${
                  isDragging
                    ? "border-[#03a74f] bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />

                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-200">
                    <Upload className="w-7 h-7 text-[#03a74f]" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Proof of Purchase / Title
                  </p>
                  <p className="text-xs text-gray-500 text-center mb-3">
                    JPG, PNG, JPEG up to 10MB
                  </p>
                  <span className="text-sm text-[#03a74f] font-semibold">
                    Click to upload
                  </span>
                </label>
              </div>

              <div
                className={`border-2 rounded-xl p-6 ${uploadedFile ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
              >
                {uploadedFile ? (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
                        <Check className="w-4 h-4" />
                        <span className="font-semibold">Upload Complete</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-[#03a74f] h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center py-8">
                    <p className="text-sm text-gray-400">No file uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prev}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#03a74f] hover:bg-[#028a42] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg"
            >
              Submit Machine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
