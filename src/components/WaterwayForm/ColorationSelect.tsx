import React, { useState, useEffect } from "react";
import { Slider } from "../ui/slider";

const ColorationSlider = ({
  disabled = false,
  selected = 1,
  updateFormData,
}: {
  disabled?: boolean;
  selected?: number;
  updateFormData: any;
}) => {
  const [selectedColor, setSelectedColor] = useState(selected);
  const colorOptions = [
    { label: "Ohne", value: 1, color: "#e5e5e5" },
    { label: "Grünlich", value: 2, color: "green" },
    { label: "Gelb", value: 3, color: "yellow" },
    { label: "Gelbbraun", value: 4, color: "goldenrod" },
  ];

  useEffect(() => {
    setSelectedColor(selected);
  }, [selected]);

  const handleChange = (value: any) => {
    if (!disabled) {
      setSelectedColor(value[0]);
      updateFormData("color", value[0]);
    }
  };

  const selectedColorOption = colorOptions.find(
    (option) => option.value === selectedColor
  );

  return (
    <div className="flex flex-col p-4 gap-4">
      <h2 className="text-xl font-semibold mr-4"> Färbung </h2>
      <div className="flex items-center w-full mb-4 gap-4">
        <Slider
          min={1}
          max={4}
          step={1}
          value={[selectedColor]}
          onValueChange={handleChange}
          disabled={disabled}
          // @ts-ignore
          color={selectedColorOption.color}
        />
      </div>
    </div>
  );
};

export default ColorationSlider;
