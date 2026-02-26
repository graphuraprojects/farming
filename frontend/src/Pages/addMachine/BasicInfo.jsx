import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, BadgeCheck } from "lucide-react";
import { color, gradientBg, shadow } from "../../theme";

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

  const inputCls =
    "px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400 bg-white w-full";

  return (
    <div className="min-h-screen flex justify-center px-2 sm:px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: color.text }}>
            Add New Machine
          </h1>
          <p className="text-sm" style={{ color: color.textSoft }}>
            Start by providing basic details for your machinery
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}
          >
            <h2 className="text-base font-bold mb-5" style={{ color: color.text }}>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Machine Name
                </label>
                <input
                  name="machineName"
                  value={data.machineName}
                  onChange={handleInputChange}
                  className={inputCls}
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  placeholder="Enter machine name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Model
                </label>
                <input
                  name="model"
                  value={data.model}
                  onChange={handleInputChange}
                  className={inputCls}
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  placeholder="Enter model"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Model Year
                </label>
                <input
                  name="modelYear"
                  type="number"
                  value={data.modelYear}
                  onChange={handleInputChange}
                  className={inputCls}
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  placeholder="Enter year"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Registration Number
                </label>
                <input
                  name="registrationNumber"
                  value={data.registrationNumber}
                  onChange={handleInputChange}
                  className={inputCls}
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  placeholder="Enter registration number"
                />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}
          >
            <h2 className="text-base font-bold mb-2" style={{ color: color.text }}>
              Machine Photos
            </h2>
            <p className="text-sm mb-5" style={{ color: color.textSoft }}>
              Upload up to 5 high-quality images
            </p>

            <div
              className="border-2 border-dashed rounded-2xl p-8 transition-all duration-200"
              style={{
                borderColor: dragActive ? color.emerald : color.inputBorder,
                background: dragActive ? color.paleGreen : color.bg,
              }}
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
                <div
                  className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4"
                  style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}
                >
                  <Upload className="w-7 h-7" style={{ color: color.emerald }} />
                </div>

                <p className="text-sm font-semibold" style={{ color: color.text }}>
                  Click to upload or drag and drop
                </p>
                <p className="text-xs mt-1" style={{ color: color.textSoft }}>
                  JPG, PNG or WebP - Maximum 10MB per file
                </p>
              </div>

              {data.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                  {data.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                      style={{ border: `2px solid ${color.border}` }}
                    >
                      <img
                        src={photo.preview}
                        className="w-full h-full object-cover"
                        alt="Machine preview"
                      />

                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ boxShadow: shadow.sm }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {[...Array(MAX_IMAGES - data.photos.length)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl flex items-center justify-center border-2 border-dashed"
                      style={{ background: color.bg, borderColor: color.inputBorder }}
                    >
                      <ImageIcon className="w-8 h-8" style={{ color: color.textSoft }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="mt-6 rounded-xl p-4 flex gap-4"
              style={{ background: color.paleGreen, border: `1px solid ${color.border}` }}
            >
              <BadgeCheck
                size={24}
                className="flex-shrink-0 mt-0.5"
                style={{ color: color.emerald }}
              />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: color.text }}>
                  Quality Photos Matter
                </p>
                <p className="text-sm leading-relaxed" style={{ color: color.textSoft }}>
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
              className="text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }}
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
