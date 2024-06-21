import React, { useEffect } from "react";

export default function OverviewWaterwayForm({
  windStrength,
  weather,
  developmentLevel,
  smellIntensity,
  coloration,
}) {
  const windStrengthOptions = [
    "Stufe 1",
    "Stufe 2",
    "Stufe 3",
    "Stufe 4",
    "Stufe 5",
  ];
  const weatherOptions = [
    "Regen",
    "Nieselregen",
    "Bewölkt",
    "Sonne mit Wolken",
    "Sonne",
  ];
  const developmentOptions = [
    "Stufe 1",
    "Stufe 2",
    "Stufe 3",
    "Stufe 4",
    "Stufe 5",
  ];
  const smellOptions = ["Neutral", "Schwach", "Mittel", "Stark", "Belästigend"];
  const colorationOptions = ["Ohne", "Grünlich", "Gelb", "Gelbbraun"];
  const colorationColors = ["#e5e5e5", "green", "yellow", "goldenrod"];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Windstärke
              </span>
              <div className="flex items-center gap-2">
                <WindIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span className="font-medium">
                  {windStrengthOptions[windStrength - 1]}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Weather</span>
              <div className="flex items-center gap-2">
                <SunIcon className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">
                  {weatherOptions[weather - 1]}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Bebauungsgrad
              </span>
              <div className="flex items-center gap-2">
                <ConstructionIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span className="font-medium">
                  {developmentOptions[developmentLevel - 1]}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Geruch</span>
              <div className="flex items-center gap-2">
                <SirenIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span className="font-medium">
                  {smellOptions[smellIntensity - 1]}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Färbung</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: colorationColors[coloration - 1] }}
                />
                <span className="font-medium">
                  {colorationOptions[coloration - 1]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConstructionIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10 14 2.3 6.3" />
      <path d="m14 6 7.7 7.7" />
      <path d="m8 6 8 8" />
    </svg>
  );
}

function SirenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
      <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
      <path d="M21 12h1" />
      <path d="M18.5 4.5 18 5" />
      <path d="M2 12h1" />
      <path d="M12 2v1" />
      <path d="m4.929 4.929.707.707" />
      <path d="M12 12v6" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function WindIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}
