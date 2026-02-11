import React, { useEffect, useRef, useState } from "react";
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
    pricePerHour: "",
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

  const hasShownAlert = useRef(false);

  useEffect(() => {
    if (hasShownAlert.current) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Not logged in
    if (!token || !user) {
      hasShownAlert.current = true;
      alert("Login first");
      navigate("/login", { replace: true });
      return;
    }

    // Role check (ONLY owner/admin)
    if (user.role !== "owner" && user.role !== "admin") {
      hasShownAlert.current = true;
      navigate("/404", { replace: true });
      alert("Access denied. Only Owner/Admin allowed.");
      return;
    }
  }, [navigate]);

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

      const res = await axios.post(
        "http://localhost:5000/api/machines",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
