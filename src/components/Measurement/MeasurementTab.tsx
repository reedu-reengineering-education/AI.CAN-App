import React, { useState } from "react";
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
const MeasurementTab = () => {
  const measurements = [
    {
      timestamp: "2023-05-01 10:30:00",
      latitude: 48.1351,
      longitude: 11.582,
      uploaded: true,
    },
    {
      timestamp: "2023-05-02 14:45:00",
      latitude: 47.3777,
      longitude: 8.5417,
      uploaded: false,
    },
    {
      timestamp: "2023-05-03 09:20:00",
      latitude: 52.52,
      longitude: 13.405,
      uploaded: true,
    },
    {
      timestamp: "2023-05-04 16:10:00",
      latitude: 51.5074,
      longitude: -0.1278,
      uploaded: false,
    },
    {
      timestamp: "2023-05-05 11:55:00",
      latitude: 40.7128,
      longitude: -74.006,
      uploaded: true,
    },
    {
      timestamp: "2023-05-02 14:45:00",
      latitude: 47.3777,
      longitude: 8.5417,
      uploaded: false,
    },
    {
      timestamp: "2023-05-03 09:20:00",
      latitude: 52.52,
      longitude: 13.405,
      uploaded: true,
    },
    {
      timestamp: "2023-05-04 16:10:00",
      latitude: 51.5074,
      longitude: -0.1278,
      uploaded: false,
    },
    {
      timestamp: "2023-05-05 11:55:00",
      latitude: 40.7128,
      longitude: -74.006,
      uploaded: true,
    },
  ];

  const [selectedMeasurement, setSelectedMeasurement] = useState<any>(null);

  const handleRowClick = (measurement: any) => {
    setSelectedMeasurement(measurement);
  };

  const handleUpload = () => {
    // Logic to handle upload
    console.log("Upload triggered for:", selectedMeasurement);
    setSelectedMeasurement(null); // Close the dialog after upload
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative">
        <Table className="w-full table-auto">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow className="bg-muted text-muted-foreground">
              <TableHead className="px-4 py-3 text-left">Zeitstempel</TableHead>
              <TableHead className="px-4 py-3 text-left">Latitude</TableHead>
              <TableHead className="px-4 py-3 text-left">Longitude</TableHead>
              <TableHead className="px-4 py-3 text-left">Status</TableHead>
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
                  onClick={() => handleRowClick(measurement)}
                >
                  <TableCell className="px-4 py-3">
                    {measurement.timestamp}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {measurement.latitude}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {measurement.longitude}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {measurement.uploaded ? (
                      <Badge variant="success"> Ja </Badge>
                    ) : (
                      <Badge variant="destructive"> Nein </Badge>
                    )}
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
              <p>Zeitstempel: {selectedMeasurement.timestamp}</p>
              <p>Latitude: {selectedMeasurement.latitude}</p>
              <p>Longitude: {selectedMeasurement.longitude}</p>
              <p>
                Status:{" "}
                {selectedMeasurement.uploaded
                  ? "Hochgeladen"
                  : "Nicht hochgeladen"}
              </p>
            </DialogDescription>
            <DialogFooter>
              <div className="flex flex-col gap-4">
                <Button
                  disabled={selectedMeasurement.uploaded}
                  onClick={handleUpload}
                >
                  Hochladen
                </Button>
                <Button
                  onClick={() => setSelectedMeasurement(null)}
                  variant="secondary"
                >
                  Abbrechen
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MeasurementTab;
