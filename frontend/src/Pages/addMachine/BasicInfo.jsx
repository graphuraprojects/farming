import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, BadgeCheck } from "lucide-react";

const MAX_IMAGES = 5;

const BasicInfo = ({ data, setData, next }) => {
  const fileRef = useRef();
  const [dragActive, setDragActive] = useState(false);

  // Handle Input Change
  const handleInputChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Drag Handler
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  // Drop Handler
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // File Picker Change
  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Handle Files
  const handleFiles = (files) => {
    let validFiles = [];

    for (let file of files) {
      // Type Check
      if (!file.type.startsWith("image/")) {
        alert("Only images allowed!");
        continue;
      }

      // Size Check (10MB)
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

  // Remove Photo
  const removePhoto = (id) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.machineName || !data.model || !data.modelYear || !data.registrationNumber) {
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
    <div className="mx-2 mt-5 flex flex-col items-center">
      <div className="px-2 max-w-200">
        <h1 className="text-3xl font-bold">Add New Machine - Basic Info</h1>

        <p className="text-gray-500">
          Start by providing basic details for your machinery.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-5 w-full flex flex-wrap gap-5"
        >
          <div className="w-full flex flex-col gap-1 max-w-[380px]">
            <label className="font-medium">Machine Name</label>

            <input
              name="machineName"
              value={data.machineName}
              onChange={handleInputChange}
              className="p-2 border rounded-md border-gray-300 bg-white focus:border-[#03a74f] focus:outline-none"
              placeholder="e.g. Eicher"
            />
          </div>

          <div className="w-full flex flex-col gap-1 max-w-[380px]">
            <label className="font-medium">Model</label>

            <input
              name="model"
              value={data.model}
              onChange={handleInputChange}
              className="p-2 border rounded-md border-gray-300 bg-white focus:border-[#03a74f] focus:outline-none"
              placeholder="e.g. 333 Super DI"
            />
          </div>

          <div className="w-full flex flex-col gap-1 max-w-[380px]">
            <label className="font-medium">Model Year</label>

            <input
              name="modelYear"
              type="number"
              value={data.modelYear}
              onChange={handleInputChange}
              className="p-2 border rounded-md border-gray-300 bg-white focus:border-[#03a74f] focus:outline-none"
              placeholder="e.g. 2020"
            />
          </div>

          <div className="w-full flex flex-col gap-1 max-w-[380px]">
            <label className="font-medium">Registration No</label>

            <input
              name="registrationNumber"
              value={data.registrationNumber}
              onChange={handleInputChange}
              className="p-2 border rounded-md border-gray-300 bg-white focus:border-[#03a74f] focus:outline-none"
              placeholder="e.g. HR 51 AB 1234"
            />
          </div>

          {/* Photos */}
          <div className="w-full">
            <label className="text-xl font-semibold block mb-4">
              Machine Photos (Max 5)
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
              {/* Upload Area */}
              <div
                className={`${dragActive ? "bg-blue-50" : ""}`}
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
                  className="flex flex-col items-center py-12 cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>

                  <p className="text-lg">Click or drag photos</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WebP (10MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mt-6">
                {data.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded overflow-hidden"
                  >
                    <img
                      src={photo.preview}
                      className="w-full h-full object-cover"
                      alt="Machine preview"
                    />

                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {[...Array(MAX_IMAGES - data.photos.length)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded flex items-center justify-center"
                  >
                    <ImageIcon className="text-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex gap-4">
            <BadgeCheck size={40} className="text-[#03a74f]" />
            <p className="text-gray-700">
              <span className="font-bold text-black">
                Quality Photos Matter
              </span>{" "}
              <br />
              Machines with clear, high-resolution photos attract more renters.
              Ensure your images showcase the machine from multiple angles and
              highlight key features.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end w-full">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded mt-4 cursor-pointer hover:bg-[#38864b] hover:-translate-y-2 transition-transform duration-300 active:scale-95"
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