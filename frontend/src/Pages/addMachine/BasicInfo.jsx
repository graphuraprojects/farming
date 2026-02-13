import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, BadgeCheck } from "lucide-react";

const MAX_IMAGES = 5;

const BasicInfo = ({ data, setData, next }) => {
  const fileRef = useRef();
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    let validFiles = [];

    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Only images allowed!");
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("Image must be under 10MB");
        continue;
      }

      validFiles.push(file);
    }

    const remainingSlots = MAX_IMAGES - data.photos.length;

    if (remainingSlots <= 0) {
      alert("Maximum 5 images allowed");
      return;
    }

    const selected = validFiles.slice(0, remainingSlots);

    const newPhotos = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const removePhoto = (id) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !data.machineName ||
      !data.model ||
      !data.modelYear ||
      !data.registrationNumber
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (data.photos.length === 0) {
      alert("Upload at least one photo");
      return;
    }

    next();
  };

  return (
  <div className="min-h-screen flex justify-center px-2 sm:px-4 py-8">
    <div className="w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Add New Machine
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Start by providing basic details for your machinery
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Machine Name
                </label>
                <input
                  name="machineName"
                  value={data.machineName}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  placeholder="Enter machine name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Model
                </label>
                <input
                  name="model"
                  value={data.model}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  placeholder="Enter model"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Model Year
                </label>
                <input
                  name="modelYear"
                  type="number"
                  value={data.modelYear}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  placeholder="Enter year"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Registration Number
                </label>
                <input
                  name="registrationNumber"
                  value={data.registrationNumber}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  placeholder="Enter registration number"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Machine Photos
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Upload up to 5 high-quality images
            </p>

            <div
              className={`border-2 border-dashed rounded-xl p-8 transition-all ${
                dragActive
                  ? "border-[#03a74f] bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileRef}
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleChange}
              />

              <div
                onClick={() => fileRef.current.click()}
                className="flex flex-col items-center py-8 cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-200">
                  <Upload className="w-7 h-7 text-[#03a74f]" />
                </div>

                <p className="text-base font-medium text-gray-800">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG or WebP - Maximum 10MB per file
                </p>
              </div>

              {data.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                  {data.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden group border-2 border-gray-200"
                    >
                      <img
                        src={photo.preview}
                        className="w-full h-full object-cover"
                        alt="Machine preview"
                      />

                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  {[...Array(MAX_IMAGES - data.photos.length)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                    >
                      <ImageIcon className="text-gray-400 w-8 h-8" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-4">
              <BadgeCheck
                size={24}
                className="text-[#03a74f] flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Quality Photos Matter
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Machines with clear, high-resolution photos attract more
                  renters. Showcase your machine from multiple angles and
                  highlight key features.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#03a74f] hover:bg-[#028a42] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicInfo;
