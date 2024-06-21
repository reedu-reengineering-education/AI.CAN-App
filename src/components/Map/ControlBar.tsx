import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Bluetooth, BluetoothOff } from "lucide-react";
import { connect } from "http2";
import useSenseBox from "@/lib/useSenseBox";
import { Switch } from "@/components/ui/switch";
import { buttonVariants } from "@/components/ui/button";
const ControlBar: React.FC = () => {
  const { connect, isConnected, disconnect } = useSenseBox();
  const handleStartMeasurement = () => {
    // TODO: Implement start measurement logic
  };

  const handleGetCoordinates = () => {
    // TODO: Implement get coordinates logic
  };

  const handleEnableBluetooth = () => {
    // TODO: Implement enable Bluetooth logic
  };

  return (
    <div className="flex w-full gap-2 ">
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={"/measurement"}
      >
        {" "}
        Neue Messung{" "}
      </Link>

      <Button className="w-full" onClick={handleEnableBluetooth}>
        Historische Messungen anzeigen
      </Button>
    </div>
  );
};

export default ControlBar;
