import React, { useState, useEffect } from "react";

const WeatherSelector = ({
  disabled = false,
  selected = 0,
  updateFormData,
}: {
  disabled?: boolean;
  selected?: number;
  updateFormData: any;
}) => {
  const weatherOptions = [
    { label: "Regen", value: 1 },
    { label: "Leichter Regen", value: 2 },
    { label: "Bewölkt", value: 3 },
    { label: "Sonne mit Wolken", value: 4 },
    { label: "Sonne", value: 5 },
  ];

  const [selectedWeather, setSelectedWeather] = useState(selected);

  useEffect(() => {
    setSelectedWeather(selected);
  }, [selected]);

  const handleSelect = (value: any) => {
    if (!disabled) {
      setSelectedWeather(value);
      updateFormData("weather", value);
    }
  };

  return (
    <div className="flex flex-col  p-4">
      {disabled ? (
        <></>
      ) : (
        <h2 className="text-xl font-semibold mb-4 "> Wetter</h2>
      )}
      <div className="flex space-x-2 bg-muted rounded-full">
        {weatherOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`text-sm px-2 py-1 rounded-full flex items-center justify-center 
              ${
                selectedWeather === option.value
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
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeatherSelector;
