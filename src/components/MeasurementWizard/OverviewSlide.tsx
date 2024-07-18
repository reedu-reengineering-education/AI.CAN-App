import Link from "next/link";
import OverviewWaterwayForm from "../OverviewWaterwayForm/OverviewWaterwayForm";
import { Button } from "../ui/button";
import { useSwiper } from "swiper/react";
import { uploadData } from "@/lib/api/openSenseMapClient";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { Loader2Icon, PointerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMeasurementStore } from "@/lib/store/useMeasurementStore";
import AnimatedNumber from "../ui/animated-number";
import { cn } from "@/lib/utils";
import usePreferences from "@/lib/store/usePreferences";
import { useStateStore } from "@/lib/store/useStateStore";
import { Toggle } from "../ui/toggle";
import { Checkbox } from "../ui/checkbox";

export default function OverviewSlide({ formData }: { formData: any }) {
  const swiper = useSwiper();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { value, saveValue, getValue } = usePreferences(formData.time);
  const { offline, setOffline } = useStateStore();
  const {
    setTemperature,
    setPh,
    setTurbidity,
    setEc,
    setGeruch,
    setGeschmack,
    setKlarheit,
    setWetter,
    setWind,
    setFarbe,
    setDevelopment,
    setTimeHistoric,
    setName,
  } = useMeasurementStore();

  // Helper function to get sensor ID by title
  const getSensorIdByTitle = (title: any, sensors: any) => {
    const sensor = sensors.find((sensor: any) => sensor.title === title);
    return sensor ? sensor._id : null;
  };

  const setValueByTitle = (title: String, setValue: any, sensors: any) => {
    const sensor = sensors.find((sensor: any) => sensor.title === title);
    if (sensor && sensor.lastMeasurement) {
      setValue(Number(sensor.lastMeasurement.value));
    }
  };

  const saveMeasurementLocally = async () => {
    saveValue(formData);
    const result = await getValue();
  };

  const handleSubmit = async () => {
    try {
      saveMeasurementLocally();
      if (offline) {
        handleUploadmeasurement();
        toast({ title: "Messung erfolgreich hochgeladen und gespeichter!" });
      } else {
        toast({ title: "Messung erfolgreich lokal gespeichert!" });
      }
      router.push("/map"); // Nach erfolgreichem Upload zur Startseite weiterleiten
    } catch (error) {
      toast({ title: `Fehler beim speichern: ${error}` });
    }
  };

  const handleUploadmeasurement = async () => {
    setLoading(true);
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
      setName("Letzte Messung");
      setTemperature(formData.temperature);
      setPh(formData.ph);
      setEc(formData.conductivity);
      setWind(formData.wind);
      setWetter(formData.weather);
      setGeruch(formData.smell);
      setFarbe(formData.color);
      setDevelopment(formData.development);

      toast({ title: "Messung erfolgreich hochgeladen" });
    } catch (error) {
      toast({ title: `Fehler beim hochladen: ${error}` });

      console.error("Error uploading data:", error);
    }
    setLoading(false);
  };

  const handleOfflineMode = (event: any) => {
    setOffline(!event);
  };

  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="space-y-4 flex tiems-center flex-col">
        <h1 className="text-3xl font-bold text-center">Zusammenfassung</h1>
        <p className="text-gray-600 text-center">
          Du kannst die Messung nochmal überprüfen und mit einem Klick auf den
          Button abschließen.
        </p>
      </div>
      <div className="flex w-full flex-col justify-around p-1 pb-safe-offset-8">
        <div className={cn("relative flex w-full flex-col divide-y")}>
          <div className={cn("grid w-full grid-cols-2 gap-1")}>
            <>
              <GridItem
                name="Wassertemperatur"
                value={formData.temperature}
                unit="°C"
              />
              <GridItem name="pH-Wert" value={formData.ph} unit="" />
              <GridItem
                name="Elektrische Leitfähigkeit"
                value={formData.conductivity}
                unit="μS/cm"
              />
            </>
          </div>
        </div>
      </div>{" "}
      <OverviewWaterwayForm
        windStrength={formData.wind}
        weather={formData.weather}
        developmentLevel={formData.development}
        smellIntensity={formData.smell}
        coloration={formData.color}
      />
      <div className="flex justify-between mt-6">
        <Button onClick={() => swiper.slidePrev()}>Zurück</Button>

        <Button onClick={() => handleSubmit()} disabled={loading} type="submit">
          {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Messung speichern
        </Button>
      </div>
    </div>
  );
}

function GridItem({
  name,
  value,
  labels,
  unit,
  decimals = 2,
}: {
  name: string;
  value: number | (number | undefined)[] | undefined;
  labels?: string[];
  unit: string;
  decimals?: number;
}) {
  const [selectedValue, setSelectedValue] = useState<number>();
  const [labelIndex, setLabelIndex] = useState<number>();

  useEffect(() => {
    if (value !== undefined && !Array.isArray(value)) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (labels && labels.length > 0 && labelIndex === undefined) {
      setLabelIndex(0);
    }
  }, [labels]);

  useEffect(() => {
    if (
      labels &&
      labels.length > 0 &&
      labelIndex !== undefined &&
      Array.isArray(value)
    ) {
      setSelectedValue(value[labelIndex]);
    }
  }, [labelIndex, value]);

  return (
    <div
      className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-md bg-muted/40 px-4 py-3"
      onClick={() => {
        if (labelIndex !== undefined && labels && labels.length > 0) {
          setLabelIndex((labelIndex + 1) % labels!.length);
        }
      }}
    >
      <div className="z-10 flex gap-1">
        <p className="whitespace-nowrap text-sm">{name}</p>
        {labels && labels.length > 0 && labelIndex !== undefined && (
          <span
            className="h-fit rounded-full px-1 py-0.5 text-[8px] text-accent"
            style={{
              // @ts-ignore
              backgroundColor: colors[chartProps.colors![labelIndex]][500],
            }}
          >
            {labels[labelIndex!]}
          </span>
        )}
      </div>
      <div className="z-10 flex  items-baseline gap-2 text-3xl">
        {selectedValue !== undefined ? (
          <div className="flex">
            <AnimatedNumber decimals={decimals}>{selectedValue}</AnimatedNumber>
            <p className="text-xs">{unit}</p>
          </div>
        ) : (
          <div className="flex gap-4">
            <PointerIcon />
            <p className="text-xs">Klicken um Messung durchzuführen</p>
          </div>
        )}
      </div>
    </div>
  );
}
