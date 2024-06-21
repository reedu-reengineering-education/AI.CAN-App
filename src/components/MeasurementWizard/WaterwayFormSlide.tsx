import { useSwiper } from "swiper/react";
import WaterwayForm from "../WaterwayForm/WaterwayForm";
import { Button } from "../ui/button";

export default function WaterWayFormSlide({
  updateFormData,
}: {
  updateFormData: any;
}) {
  const swiper = useSwiper();

  return (
    <div className="flex flex-col h-screen w- justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Gewässergütekartierung
        </h1>
        <p className="text-gray-600 text-center">
          Gebe jetzt ein paar Informationen zu dem Gewässer an.
        </p>
      </div>
      <WaterwayForm updateFormData={updateFormData} />
      <div className="flex justify-between mt-6">
        <Button onClick={() => swiper.slidePrev()}>Zurück</Button>
        <Button onClick={() => swiper.slideNext()}>Weiter</Button>
      </div>
    </div>
  );
}
