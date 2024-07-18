import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import usePreferences from "@/lib/store/usePreferences";
import { format } from "date-fns"; // Importiere die date-fns Bibliothek
import { de } from "date-fns/locale"; // Importiere die deutsche Lokalisierung
import MeasurementsGrid from "../ui/MeasurementsGrid";
import OverviewWaterwayForm from "../OverviewWaterwayForm/OverviewWaterwayForm";
import { TrashIcon, UploadIcon } from "lucide-react";
import MeasurementTabDialog from "./MeasurementTabDialog";

const MeasurementTab = ({ showOnMap }: { showOnMap: any }) => {
  const [selectedMeasurement, setSelectedMeasurement] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const { removeValue, getAllValues } = usePreferences("measurements"); // Verwende die Hook für die Messungen

  const handleRowClick = (measurement: any) => {
    setSelectedMeasurement(measurement);
    console.log(measurement);
    showOnMap();
  };

  useEffect(() => {
    const loadMeasurements = async () => {
      const values = await getAllValues();
      console.log(values);
      if (values) {
        setMeasurements(values);
      }
    };
    loadMeasurements();
  }, [getAllValues, selectedMeasurement]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative">
        <Table className="w-full table-auto">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow className="bg-muted text-muted-foreground">
              <TableHead className="px-4 py-3 text-left">Zeitstempel</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="h-64 overflow-y-auto">
          <Table className="w-full table-auto">
            <TableBody>
              {measurements.map((measurement, index) => (
                <TableRow
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-background" : "bg-stone-100"
                  }`}
                >
                  <TableCell className="px-2 py-1">
                    {format(new Date(measurement.time), "PPPpp", {
                      locale: de,
                    })}{" "}
                    {/* Formatieren des Zeitstempels */}
                  </TableCell>
                  <TableCell className="px-2 py-1">
                    <Button
                      onClick={() =>
                        showOnMap([
                          measurement.position.longitude,
                          measurement.position.latitude,
                        ])
                      }
                      variant="secondary"
                    >
                      Karte
                    </Button>
                    {/* Formatieren des Zeitstempels */}
                  </TableCell>
                  <TableCell className="px-2 py-1">
                    <Button
                      onClick={() => handleRowClick(measurement)}
                      variant="secondary"
                    >
                      Details
                    </Button>
                    {/* Formatieren des Zeitstempels */}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={measurement.box ? "success" : "destructive"}
                      className="px-2 py-1 text-center"
                    >
                      {measurement.box ? "Hochgeladen" : "Nicht hochgeladen"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedMeasurement && (
        <Dialog
          open={Boolean(selectedMeasurement)}
          onOpenChange={() => setSelectedMeasurement(null)}
        >
          <DialogTrigger />
          <DialogContent>
            <DialogTitle>Messungsübersicht</DialogTitle>
            <DialogDescription>
              Zeitstempel:{" "}
              {format(new Date(selectedMeasurement.time), "PPPpp", {
                locale: de,
              })}{" "}
              <br></br>
              Status:{" "}
              {selectedMeasurement.box ? "Hochgeladen" : "Nicht hochgeladen"}
              <br></br>
              {selectedMeasurement.box
                ? `Box: ${selectedMeasurement.box.name}`
                : null}
            </DialogDescription>

            <MeasurementTabDialog
              selectedMeasurement={selectedMeasurement}
              setSelectedMeasurement={setSelectedMeasurement}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MeasurementTab;
