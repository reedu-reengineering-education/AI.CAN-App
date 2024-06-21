import { useSwiper } from "swiper/react";
import { Button } from "../ui/button";
import Image from "next/image";
import WizardSlide from "./WizardSlide";
import waterDrop from "../../../public/waterDrop.png";

export default function Welcome() {
  const swiper = useSwiper();

  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">
          Neue Messung hinzufügen
        </h1>
        <p className="text-gray-600 text-center">
          In den folgenden Schritten werden wir gemeinsam durch den Prozess der
          Wassermessung gehen. Lass uns beginnen!
        </p>
        <div className="flex justify-center">
          <Image
            src={waterDrop}
            alt="Water Measurement"
            width={200}
            height={200}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={() => swiper.slideNext()}>Weiter</Button>
      </div>
    </div>
  );
}
