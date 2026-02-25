import React, { useState } from "react";
import BasicInfo from "./BasicInfo";
import Specs from "./Specs";
import Location from "./Location";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMachine = () => {
  const [step, setStep] = useState(1);

  const steps = ["Basic Info", "Specs & Pricing", "Location"];
  const navigate = useNavigate();

  const [machineData, setMachineData] = useState({
    // Basic Info
    machineName: "",
    model: "",
    modelYear: "",
    registrationNumber: "",
    photos: [],

    // Specs
    fuelType: "",
    category: "",
    pricePerDay: "",
    transport: "",

    // Location
    lat: "",
    lng: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Document
    document: null,
  });

  if (JSON.parse(localStorage.getItem("user") || "{}").isBlocked) {
    alert(
      "⚠️ You are blocked. You cannot add machines. Please contact support.",
    );
    navigate("/404");
    return;
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      const data = {
        machine_name: machineData.machineName,
        model: machineData.model,
        model_year: machineData.modelYear,
        registration_no: machineData.registrationNumber,
        fuel_type: machineData.fuelType,
        category: machineData.category,
        price_per_day: machineData.pricePerDay,
        transport: machineData.transport,

        latitude: machineData.lat,
        longitude: machineData.lng,

        address: {
          street: machineData.address,
          city: machineData.city,
          state: machineData.state,
          zip: machineData.zipCode,
          country: machineData.country,
        },
      };

      formData.append("data", JSON.stringify(data));

      // Images
      machineData.photos.forEach((photo) => {
        formData.append("images", photo.file);
      });

      // Ownership proof (FIXED)
      if (machineData.document) {
        formData.append("ownership_proof", machineData.document);
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(`/api/machines`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("Machine Added Successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("Upload failed");
    }
  };

  return (
    <div className="bg-[#e9fbf1cc] pb-10 min-h-screen overflow-x-hidden">
      {/* ADDED: overflow-x-hidden to prevent horizontal scroll */}

      <div className="pt-6 w-full flex justify-center px-2 sm:px-4">
        {/* CHANGED: px-4 to px-2 sm:px-4 for better mobile spacing */}

        {/* Step Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-full overflow-x-auto">
          {/* ADDED: gap responsive + max-w-full + overflow-x-auto */}

          {steps.map((title, index) => {
            const stepNumber = index + 1;

            const isCompleted = step > stepNumber;
            const isActive = step === stepNumber;

            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]">
                  {/* CHANGED: min-w-[70px] to min-w-[60px] sm:min-w-[70px] */}

                  <div
                    className={`
                      w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold
                      ${
                        isCompleted || isActive
                          ? "bg-[#03a74f] text-white"
                          : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {/* CHANGED: w-8 h-8 to w-7 h-7 sm:w-8 sm:h-8 for smaller mobile */}
                    {isCompleted ? "✓" : stepNumber}
                  </div>

                  {/* title */}
                  <span
                    className={`
                      mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-center leading-tight
                      ${
                        isActive || isCompleted
                          ? "text-[#03a74f]"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {/* CHANGED: mt-2 to mt-1 sm:mt-2, text-xs to text-[10px] sm:text-xs */}
                    {title}
                  </span>
                </div>

                {/* line */}
                {index !== steps.length - 1 && (
                  <div
                    className={`
                      w-8 sm:w-12 md:w-16 h-[2px] flex-shrink-0
                      ${step > stepNumber ? "bg-[#03a74f]" : "bg-gray-300"}
                    `}
                  >
                    {/* CHANGED: w-16 to w-8 sm:w-12 md:w-16 + added flex-shrink-0 */}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {step === 1 && (
        <BasicInfo
          data={machineData}
          setData={setMachineData}
          next={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Specs
          data={machineData}
          setData={setMachineData}
          next={() => setStep(3)}
          prev={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Location
          data={machineData}
          setData={setMachineData}
          prev={() => setStep(2)}
          submit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AddMachine;
