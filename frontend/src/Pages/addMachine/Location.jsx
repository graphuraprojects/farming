import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapPin, Upload, FileText, Check, Trash2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom green marker icon
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

  // Sync location state with parent data
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

  // Sync document with parent data
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      document: uploadedFile,
    }));
  }, [uploadedFile]);

  // Component to handle map clicks and marker dragging
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
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please upload a PDF file");
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
    if (!location.lat || !location.lng) {
      alert("Please select a location on the map");
      return;
    }

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Map Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Base Location
              </h2>
            </div>
            <button
              onClick={getCurrentLocation}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Use current location
            </button>
          </div>

          <div className="relative">
            {isLoadingLocation ? (
              <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    Getting your location...
                  </p>
                </div>
              </div>
            ) : location.lat && location.lng ? (
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                ref={mapRef}
                style={{ height: "256px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            ) : (
              <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Location not available
                  </p>
                  <button
                    onClick={getCurrentLocation}
                    className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Drag the pin to adjust the exact pickup location.
            </p>
          </div>
        </div>

        {/* Address Details */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Address Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                value={location.address}
                onChange={(e) =>
                  setLocation({ ...location, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) =>
                    setLocation({ ...location, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  value={location.state}
                  onChange={(e) =>
                    setLocation({ ...location, state: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Zip / Postal Code
                </label>
                <input
                  type="text"
                  value={location.zipCode}
                  onChange={(e) =>
                    setLocation({ ...location, zipCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Country
                </label>
                <select
                  value={location.country}
                  onChange={(e) =>
                    setLocation({ ...location, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
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

        {/* Ownership Verification */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Ownership Verification
              </h3>
            </div>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <FileText className="w-4 h-4" />
              Secure
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Upload documents to verify legal ownership. Required for insurance
            coverage
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Proof of Purchase / Title
                </p>
                <p className="text-xs text-gray-500 text-center">
                  PDF, JPG or PNG up to 10MB
                </p>
                <p className="text-xs text-green-600 font-medium mt-2">
                  Click to upload
                </p>
              </label>
            </div>

            {/* Uploaded File Display */}
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              {uploadedFile ? (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-xs text-green-600 mb-1">
                      <Check className="w-3 h-3" />
                      <span className="font-medium">Uploaded</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-gray-400">No file uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          className="
            px-6 py-2 border-2 rounded-md cursor-pointer
            text-gray-700 hover:bg-white hover:text-black hover:-translate-y-2 transition-transform duration-300 active:scale-95 hover:border-white
          "
          onClick={prev}
        >
          Back
        </button>

        <button
          type="button"
          className="
            px-6 py-2 rounded-md
            bg-[#03a74f] text-white cursor-pointer
            hover:bg-[#38864b] hover:-translate-y-2 transition-transform duration-300 active:scale-95
          "
          onClick={handleSubmit}
        >
          Submit Machine
        </button>
      </div>
    </div>
  );
};

export default Location;
