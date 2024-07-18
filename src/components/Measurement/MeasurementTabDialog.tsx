import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import MeasurementsGrid from "../ui/MeasurementsGrid";
import OverviewWaterwayForm from "../OverviewWaterwayForm/OverviewWaterwayForm";
import { Button, buttonVariants } from "../ui/button";
import { Loader2Icon, TrashIcon, UploadIcon } from "lucide-react";
import usePreferences from "@/lib/store/usePreferences";
import LoginAndSelectBox from "../openSenseMap/LoginAndSelectBox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { use, useEffect, useState } from "react";
import { toast, useToast } from "../ui/use-toast";
import { uploadData } from "@/lib/api/openSenseMapClient";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";
import BoxSelect from "../openSenseMap/BoxSelect";

export default function MeasurementTabDialog({
  selectedMeasurement,
  setSelectedMeasurement,
}: {
  selectedMeasurement: any;
  setSelectedMeasurement: any;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const selectedBox = useAuthStore((state) => state.selectedBox);
  const { removeValue, saveValue } = usePreferences(selectedMeasurement.time); // Verwende die Hook für die Messungen
  // Helper function to get sensor ID by title
  const getSensorIdByTitle = (title: any, sensors: any) => {
    const sensor = sensors.find((sensor: any) => sensor.title === title);
    return sensor ? sensor._id : null;
  };

  useEffect(() => {
    console.log(selectedMeasurement);
  }, [selectedMeasurement]);

  const handleUpload = async () => {
    // Logic to handle upload
    setLoading(true);
    // build data object
    if (selectedBox !== undefined) {
      try {
        const sensors = selectedBox.sensors;
        const measurements = [
          { title: "Wassertemperatur", value: selectedMeasurement.temperature },
          { title: "pH-Wert", value: selectedMeasurement.ph },
          {
            title: "Elektrische Leitfähigkeit",
            value: selectedMeasurement.conductivity,
          },
          { title: "Windstärke", value: selectedMeasurement.wind },
          { title: "Wetter", value: selectedMeasurement.weather },
          { title: "Bebauungsgrad", value: selectedMeasurement.development },
          { title: "Geruch", value: selectedMeasurement.smell },
          { title: "Färbung", value: selectedMeasurement.color },
        ];
        const data = measurements.map((measurement) => ({
          sensor: getSensorIdByTitle(measurement.title, sensors),
          value: measurement.value,
          location: [
            selectedMeasurement.position.longitude,
            selectedMeasurement.position.latitude,
          ],
          createdAt: selectedMeasurement.time,
        }));

        await uploadData(selectedBox, data);
        toast({ title: "Messung erfolgreich hochgeladen" });
        selectedMeasurement.box = selectedBox;
        saveValue(selectedMeasurement);
      } catch (error) {
        toast({ title: `Fehler beim hochladen: ${error}` });
      }
    }
    setLoading(false);
    // set data as uploaded inside preferences

    setSelectedMeasurement(null); // Close the dialog after upload
  };

  const handleRemove = () => {
    removeValue();
    toast({ title: "Messung entfernt" });
    setSelectedMeasurement(null);
  };

  return (
    <div>
      <Tabs>
        <TabsList className="flex justify-evenly w-full">
          <TabsTrigger value="measurement">Werte</TabsTrigger>
          <TabsTrigger value="upload">Hochladen</TabsTrigger>
        </TabsList>
        <TabsContent value="measurement">
          <MeasurementsGrid
            values={{
              temperature: selectedMeasurement.temperature,
              ph: selectedMeasurement.ph,
              ec: selectedMeasurement.conductivity,
            }}
          />
          <OverviewWaterwayForm
            windStrength={selectedMeasurement.wind}
            weather={selectedMeasurement.weather}
            developmentLevel={selectedMeasurement.development}
            smellIntensity={selectedMeasurement.smell}
            coloration={selectedMeasurement.color}
          />
        </TabsContent>
        <TabsContent className="p-2" value="upload">
          {isLoggedIn ? (
            <BoxSelect />
          ) : (
            <div className="flex flex-col gap-2">
              {" "}
              Bitte melde dich an um die Messwerte hochzuladen
              <Link
                href="/login"
                className={buttonVariants({ variant: "default" })}
              >
                Zur Anmeldung
              </Link>{" "}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-4">
        <Button disabled={!selectedBox || loading} onClick={handleUpload}>
          {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}{" "}
          Hochladen
        </Button>
        <Button onClick={handleRemove} variant="destructive">
          <TrashIcon /> Remove Measurement
        </Button>
        <Button
          onClick={() => setSelectedMeasurement(null)}
          variant="secondary"
        >
          Abbrechen
        </Button>
      </div>
    </div>
  );
}
