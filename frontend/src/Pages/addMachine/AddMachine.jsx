import React, { useState } from "react";
import BasicInfo from "./BasicInfo";
import Specs from "./Specs";
import Location from "./Location";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { color, gradientBg } from "../../theme";

const AddMachine = () => {
  const [step, setStep] = useState(1);

  const steps = ["Basic Info", "Specs & Pricing", "Location"];
  const navigate = useNavigate();

  const [machineData, setMachineData] = useState({
    machineName: "",
    model: "",
    modelYear: "",
    registrationNumber: "",
    photos: [],
    fuelType: "",
    category: "",
    pricePerDay: "",
    transport: "",
    lat: "",
    lng: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
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

      machineData.photos.forEach((photo) => {
        formData.append("images", photo.file);
      });

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
    <div className="pb-10 min-h-screen overflow-x-hidden" style={{ background: `${color.mintCream}cc` }}>
      <div className="pt-6 w-full flex justify-center px-2 sm:px-4">
        {/* Step Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-full overflow-x-auto">
          {steps.map((title, index) => {
            const stepNumber = index + 1;
            const isCompleted = step > stepNumber;
            const isActive = step === stepNumber;

            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-300"
                    style={
                      isCompleted || isActive
                        ? { background: gradientBg(color.emerald, color.forest), color: "white" }
                        : { background: "#e5e7eb", color: color.textSoft }
                    }
                  >
                    {isCompleted ? "✓" : stepNumber}
                  </div>

                  <span
                    className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-center leading-tight"
                    style={{ color: isActive || isCompleted ? color.emerald : color.textSoft }}
                  >
                    {title}
                  </span>
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className="w-8 sm:w-12 md:w-16 h-[2px] flex-shrink-0 rounded-full"
                    style={{ background: step > stepNumber ? color.emerald : "#d1d5db" }}
                  />
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
