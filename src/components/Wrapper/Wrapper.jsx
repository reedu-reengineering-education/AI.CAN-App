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

export default function Wrapper() {
  const { name, geruch, wind, wetter, farbe, development } =
    useMeasurementStore();

  return (
    <div className="flex flex-col h-screen">
      <div className="basis-1/4">
        <Map />
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
              <MeasurementsGrid useHistoric={true} />
            </div>
            <div className="flex flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger>
                  <Button>
                    <Clipboard /> Gewässergüte
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>Gewässergütekartierung</DialogHeader>
                  <DialogDescription>
                    <OverviewWaterwayForm
                      windStrength={wind}
                      weather={wetter}
                      developmentLevel={development}
                      smellIntensity={geruch}
                      coloration={farbe}
                    />
                  </DialogDescription>
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
            <MeasurementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
