import { useSwiper } from "swiper/react";
import { Button } from "../ui/button";
import Image from "next/image";
import WizardSlide from "./WizardSlide";
import waterDrop from "../../../public/waterDrop.png";
import { BluetoothIcon } from "lucide-react";
import useBLEDevice from "@/lib/useBLE";
import useSenseBox from "@/lib/useSenseBox";

export default function BluetoothSlide({
  updateFormData,
}: {
  updateFormData: any;
}) {
  const swiper = useSwiper();

  const { connect, isConnected, disconnect } = useSenseBox();

  return (
    <WizardSlide className="flex h-full flex-col  justify-center gap-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center">
            Bluetooth Verbindung
          </h1>
          <p className="text-gray-600 text-center">
            Lass uns nun die Bluetooth Verbindung zur WassersenseBox herstellen.
          </p>
        </div>
        <div className="flex justify-center m-6">
          <Button onClick={() => connect()}>
            <BluetoothIcon />
            Scannen
          </Button>
        </div>

        <div className="flex justify-end mt-6">
          {/* <Button disabled={!isConnected} onClick={() => swiper.slideNext()}>
            Weiter
          </Button> */}
          <Button onClick={() => swiper.slideNext()}>Weiter</Button>
        </div>
      </div>
    </WizardSlide>
  );
}
