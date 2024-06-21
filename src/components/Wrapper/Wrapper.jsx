"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeasurementStore } from "@/lib/store/useMeasurementStore";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Clipboard, PlusIcon } from "lucide-react";
import Link from "next/link";
import Map from "../Map/Map";
import MeasurementTab from "../Measurement/MeasurementTab";
import OverviewWaterwayForm from "../OverviewWaterwayForm/OverviewWaterwayForm";
import MeasurementsGrid from "../ui/MeasurementsGrid";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

export default function Wrapper() {
  const { name } = useMeasurementStore();
  return (
    <div className="flex flex-col h-screen">
      <div className="basis-1/4">
        <Map />
      </div>
      <div className=" bg-white w-full">
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
                      windStrength={1}
                      weather={2}
                      developmentLevel={5}
                      smellIntensity={4}
                      coloration={3}
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
            <div className="mb-safe" />
          </TabsContent>
          <TabsContent value="measurements">
            <MeasurementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
