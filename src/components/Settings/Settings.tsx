import React from "react";
import BoxSelect from "../openSenseMap/BoxSelect";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

interface SettingsProps {
  // Add any props you need for the settings component
}

const SettingsComponent: React.FC<SettingsProps> = () => {
  // Add your component logic here

  return (
    <div className="flex flex-col gap-2">
      <BoxSelect />
      {/* Add your settings UI here */}
      <div className="flex flex-col">
        <Link href="/map" className={buttonVariants({ variant: "default" })}>
          Zurück zur Karte
        </Link>
      </div>
    </div>
  );
};

export default SettingsComponent;
