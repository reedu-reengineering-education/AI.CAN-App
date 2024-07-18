"use client";

import Map from "../Map/Map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentIcon } from "@heroicons/react/24/outline";
import ControlBar from "../Map/ControlBar";
import WaterwayForm from "../WaterwayForm/WaterwayForm";
import OverviewWaterwayForm from "../OverviewWaterwayForm/OverviewWaterwayForm";
import MeasurementsGrid from "../ui/MeasurementsGrid";
import { Clipboard, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import MeasurementTab from "../Measurement/MeasurementTab";
import { useMeasurementStore } from "@/lib/store/useMeasurementStore";
import { useRef, useState } from "react";
import { MapRef } from "react-map-gl/dist/esm/exports-maplibre";

export default function Wrapper() {
  const {
    name,
    geruch,
    wind,
    wetter,
    farbe,
    development,
    temperatureHistoric,
    phHistoric,
    ecHistoric,
  } = useMeasurementStore();

  const [center, setCenter] = useState([0, 0]);
  const mapRef = useRef<MapRef>(null);

  const handleSetCenter = (center: [number, number]) => {
    setCenter(center);
    mapRef.current?.flyTo({
      center: center,
      essential: true,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="basis-1/4">
        <Map ref={mapRef} />
      </div>
      <div className=" bg-white w-full  ">
        <Tabs defaultValue="mapview">
          <TabsList className="flex  justify-evenly rounded-md gap-4">
            <TabsTrigger value="mapview">Kartenansicht</TabsTrigger>
            <TabsTrigger value="measurements">Meine Messungen</TabsTrigger>
          </TabsList>
          <TabsContent value="mapview">
            <h2 className="text-2xl font-bold text-center mt-4">{name}</h2>
            <div>
              <MeasurementsGrid
                values={{
                  temperature: temperatureHistoric,
                  ph: phHistoric,
                  ec: ecHistoric,
                }}
              />
            </div>
            <div className="flex flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger>
                  <Button asChild>
                    <div>
                      <Clipboard /> Gewässergüte
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>Gewässergütekartierung</DialogHeader>
                  <OverviewWaterwayForm
                    windStrength={wind}
                    weather={wetter}
                    developmentLevel={development}
                    smellIntensity={geruch}
                    coloration={farbe}
                  />
                </DialogContent>
              </Dialog>
              <Button asChild>
                <Link href="/measurement/new">
                  <PlusIcon className="mr-2" />
                  Neue Messung
                </Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="measurements">
            <MeasurementTab showOnMap={handleSetCenter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
