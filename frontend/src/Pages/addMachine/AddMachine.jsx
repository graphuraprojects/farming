import React, { useState } from "react";
import BasicInfo from "./BasicInfo";
import Specs from "./Specs";
import Location from "./Location";
import axios from "axios";

const AddMachine = () => {
  const [step, setStep] = useState(1);

  const steps = ["Basic Info", "Specs & Pricing", "Location"];

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
    pricePerHour: "",

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
        price_per_hour: machineData.pricePerHour,
        latitude: machineData.lat,
        longitude: machineData.lng,

        // Fix address structure to match backend schema
        address: {
          street: machineData.address,
          city: machineData.city,
          state: machineData.state,
          zip: machineData.zipCode,
          country: machineData.country,
        },
      };

      formData.append("data", JSON.stringify(data));

      machineData.photos.forEach((photo) => {
        formData.append("images", photo.file);
      });

      if (machineData.document) {
        formData.append("document", machineData.document);
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/machines",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        alert("Machine Added Successfully!");
        setMachineData({
          machineName: "",
          model: "",
          modelYear: "",
          registrationNumber: "",
          photos: [],
          fuelType: "",
          category: "",
          pricePerHour: "",
          lat: "",
          lng: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          document: null,
        });
        setStep(1);
      }
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data); // More detailed error
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-[#e9fbf1cc] pb-10 min-h-screen">
      <div className="pt-6 w-full flex justify-center px-4">
        {/* Step Bar */}
        <div className="flex items-center justify-center gap-6">
          {steps.map((title, index) => {
            const stepNumber = index + 1;

            const isCompleted = step > stepNumber;
            const isActive = step === stepNumber;

            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center min-w-[70px]">
                  <div
                    className={`
                  w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                  ${
                    isCompleted || isActive
                      ? "bg-[#03a74f] text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                  >
                    {isCompleted ? "✓" : stepNumber}
                  </div>

                  {/* title */}
                  <span
                    className={`
                  mt-2 text-xs font-medium text-center
                  ${
                    isActive || isCompleted ? "text-[#03a74f]" : "text-gray-400"
                  }
                `}
                  >
                    {title}
                  </span>
                </div>

                {/* line */}
                {index !== steps.length - 1 && (
                  <div
                    className={`
                  w-16 h-[2px]
                  ${step > stepNumber ? "bg-[#03a74f]" : "bg-gray-300"}
                `}
                  ></div>
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
