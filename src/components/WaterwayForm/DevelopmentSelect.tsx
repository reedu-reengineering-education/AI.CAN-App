import React, { useState, useEffect } from "react";

const DevelopmentLevelSelector = ({
  disabled = false,
  selected = 0,
  updateFormData,
}: {
  disabled?: boolean;
  selected?: number;
  updateFormData: any;
}) => {
  const [selectedLevel, setSelectedLevel] = useState(selected);
  const levels = [
    { label: "Stufe 1", value: 1 },
    { label: "Stufe 2", value: 2 },
    { label: "Stufe 3", value: 3 },
    { label: "Stufe 4", value: 4 },
    { label: "Stufe 5", value: 5 },
  ];

  useEffect(() => {
    setSelectedLevel(selected);
  }, [selected]);

  const handleSelect = (value: any) => {
    if (!disabled) {
      setSelectedLevel(value);
      updateFormData("development", value);
    }
  };

  return (
    <div className="flex flex-col  p-4">
      {disabled ? (
        <></>
      ) : (
        <h2 className="text-xl font-semibold mb-4"> Bebauungsgrad</h2>
      )}
      <div className="flex space-x-2 justify-evenly bg-muted rounded-full">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => handleSelect(level.value)}
            className={`text-sm px-2 py-1 rounded-full flex items-center justify-center 
              ${
                selectedLevel === level.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }
              ${
                disabled
                  ? "cursor-not-allowed"
                  : "hover:bg-blue-400 transition duration-300"
              }`}
            disabled={disabled}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentLevelSelector;
