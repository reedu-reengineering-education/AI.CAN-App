import React, { useState, useEffect } from "react";
import { Slider } from "../ui/slider";

const SmellIntensitySlider = ({
  disabled = false,
  selected = 0,
  updateFormData,
}: {
  disabled?: boolean;
  selected?: number;
  updateFormData: any;
}) => {
  const [selectedIntensity, setSelectedIntensity] = useState(selected);
  const intensities = [
    { label: "Neutral", value: 1 },
    { label: "Schwach", value: 2 },
    { label: "Mittel", value: 3 },
    { label: "Stark", value: 4 },
    { label: "Belastend", value: 5 },
  ];

  useEffect(() => {
    setSelectedIntensity(selected);
  }, [selected]);

  const handleChange = (event: any) => {
    if (!disabled) {
      setSelectedIntensity(Number(event[0]));
      updateFormData("smell", Number(event[0]));
    }
  };

  return (
    <div className="flex flex-col items-center p-4 ">
      <Slider
        min={1}
        max={5}
        step={1}
        onValueChange={handleChange}
        disabled={disabled}
        color="#272e3f"
      />

      <div className="flex justify-between w-full mt-2">
        {intensities.map((intensity) => (
          <span key={intensity.value} className="text-sm">
            {intensity.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SmellIntensitySlider;
