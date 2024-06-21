import Link from "next/link";
import OverviewWaterwayForm from "../OverviewWaterwayForm/OverviewWaterwayForm";
import MeasurementsGrid from "../ui/MeasurementsGrid";
import { Button } from "../ui/button";
import { useSwiper } from "swiper/react";
import { uploadData } from "@/lib/api/openSenseMapClient";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
export default function OverviewSlide({ formData }: { formData: any }) {
  const swiper = useSwiper();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Helper function to get sensor ID by title
  const getSensorIdByTitle = (title: any, sensors: any) => {
    const sensor = sensors.find((sensor: any) => sensor.title === title);
    return sensor ? sensor._id : null;
  };

  const handleUploadmeasurement = async () => {
    setLoading(true);
    console.log(formData);
    // Implement the upload functionality here
    const sensors = formData.sensors;
    const data = [
      {
        sensor: getSensorIdByTitle("Wassertemperatur", sensors),
        value: formData.temperature,
        location: [formData.position.longitude, formData.position.latitude],
        createdAt: new Date().toISOString(),
      },
      {
        sensor: getSensorIdByTitle("pH-Wert", sensors),
        value: formData.ph,
        location: [formData.position.longitude, formData.position.latitude],
        createdAt: new Date().toISOString(),
      },
      {
        sensor: getSensorIdByTitle("Elektrische Leitfähigkeit", sensors),
        value: formData.conductivity,
        location: [formData.position.longitude, formData.position.latitude],
        createdAt: new Date().toISOString(),
      },
      {
        sensor: getSensorIdByTitle("Windstärke", sensors),
        value: formData.wind,
        location: [formData.position.longitude, formData.position.latitude],
        createdAt: new Date().toISOString(),
      },
      {
        sensor: getSensorIdByTitle("Wetter", sensors),
        value: formData.weather,
        location: [formData.position.longitude, formData.position.latitude],
        createdAt: new Date().toISOString(),
      },
      {
        sensor: getSensorIdByTitle("Geruch", sensors),
        value: formData.smell,
        location: [formData.position.longitude, formData.position.latitude],
        createdAt: new Date().toISOString(),
      },
      {
        sensor: getSensorIdByTitle("Färbung", sensors),
        value: formData.color,
        location: [formData.position.longitude, formData.position.latitude],
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      await uploadData(formData.box, data);
      toast({ title: "Messung erfolgreich hochgeladen" });
      router.push("/"); // Nach erfolgreichem Upload zur Startseite weiterleiten
    } catch (error) {
      toast({ title: `Fehler beim hochladen: ${error}` });

      console.error("Error uploading data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">Zusammenfassung</h1>
        <p className="text-gray-600 text-center">
          Du kannst die Messung nochmal überprüfen und mit einem Klick auf den
          Button abschließen.
        </p>
      </div>
      <MeasurementsGrid useHistoric={true} />
      <OverviewWaterwayForm
        windStrength={formData.wind}
        weather={formData.weather}
        developmentLevel={formData.development}
        smellIntensity={formData.smell}
        coloration={formData.color}
      />
      <div className="flex justify-between mt-6">
        <Button onClick={() => swiper.slidePrev()}>Zurück</Button>
        <Button
          onClick={() => handleUploadmeasurement()}
          disabled={loading}
          type="submit"
        >
          {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Messung speicher
        </Button>
      </div>
    </div>
  );
}
