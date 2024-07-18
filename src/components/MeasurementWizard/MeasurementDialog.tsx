import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DiscIcon } from "lucide-react";
import AnimatedNumber from "@/components/ui/animated-number";
import { useSenseBoxValuesStore } from "@/lib/store/useSenseBoxValuesStore";
import { toast } from "../ui/use-toast";

export default function MeasurementDialog({
  name,
  unit,
  updateFormData,
}: {
  name: string;
  unit: string;
  updateFormData: any;
}) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [isRecording, setIsRecording] = useState(false);
  const [measurementDone, setMeasurementDone] = useState(false);
  const { temperature, ph, ec, turbidity } = useSenseBoxValuesStore();
  const [value, setValue] = useState<number | undefined>();

  useEffect(() => {
    let timer: any;
    let temperatureSum: any = 0;
    let phSum: any = 0;
    let ecSum: any = 0;
    let counter = 0;
    if (isRecording && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
        setProgress((prev) => prev + 1);
        switch (name) {
          case "Wassertemperatur":
            temperatureSum += temperature;
            break;
          case "ph-Wert":
            phSum += ph;
            break;
          case "Elektrische Leitfähigkeit":
            ecSum += ec;
            break;
          case "Trübung":
            break;
        }
        counter++;
      }, 1000);
    } else if (isRecording && timeRemaining === 0) {
      setIsRecording(false);
    }
    if (isRecording && progress >= 5) {
      setIsRecording(false);
      switch (name) {
        case "Wassertemperatur":
          updateFormData("temperature", temperature);
          setValue(temperature);
          break;
        case "ph-Wert":
          updateFormData("ph", ph);
          setValue(ph);
          break;
        case "Elektrische Leitfähigkeit":
          updateFormData("conductivity", ec);
          setValue(ec);
          break;
      }

      setProgress(0);
      setTimeRemaining(5);

      setMeasurementDone(true);
    }
    return () => clearInterval(timer);
  }, [isRecording, timeRemaining]);

  const handleRecord = () => {
    setValue(0);
    setIsRecording(true);
    setProgress(0);
    setTimeRemaining(5);
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Messung</h2>
        <p className="text-muted-foreground mb-6">
          Das Messgerät in den Behälter tauchen, auf den Knopf drücken und 5
          Sekunden warten. Das Ergebnis wird dann angezeigt.
        </p>
        <Button
          onClick={handleRecord}
          className="bg-primary text-primary-foreground  rounded-md px-4 py-2 mb-4 w-full"
          disabled={isRecording}
        >
          <DiscIcon className="animate-pulse" />{" "}
          {!isRecording ? "Aufnehmen" : "Messung wird durchgeführt..."}
        </Button>
        {isRecording ? (
          <div>
            <Progress value={progress * 20} />
            <p className="text-sm text-muted-foreground">
              Time remaining: {5 - progress}
            </p>
          </div>
        ) : null}
        {measurementDone ? (
          <div>
            <GridItem name={name} value={value} unit={unit} />
          </div>
        ) : null}
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
        ) : null}
      </div>
    </div>
  );
}
