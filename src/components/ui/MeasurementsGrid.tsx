import { useAuthStore } from "@/lib/store/useAuthStore";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import AnimatedNumber from "./animated-number";
import { useSenseBoxValuesStore } from "@/lib/store/useSenseBoxValuesStore";
import { useMeasurementStore } from "@/lib/store/useMeasurementStore";
import { motion } from "framer-motion";

const MeasurementsGrid = ({ useHistoric }: { useHistoric: boolean }) => {
  const { temperature, ph, ec, turbidity } = useSenseBoxValuesStore();
  const { temperatureHistoric, phHistoric, ecHistoric, turbidityHistoric } =
    useMeasurementStore();
  const selectedBox = useAuthStore((state) => state.selectedBox);

  return (
    <div className="flex w-full flex-col justify-around p-1 pb-safe-offset-8">
      <div className={cn("relative flex w-full flex-col divide-y")}>
        <div className={cn("grid w-full grid-cols-2 gap-1")}>
          {useHistoric ? (
            <>
              <GridItem
                name="Wassertemperatur"
                value={temperatureHistoric}
                unit="°C"
              />
              <GridItem name="pH-Wert" value={phHistoric} unit="" />
              <GridItem
                name="Elektrische Leitfähigkeit"
                value={ecHistoric}
                unit="μS/cm"
              />
            </>
          ) : (
            <>
              <GridItem name="Wassertemperatur" value={temperature} unit="°C" />
              <GridItem name="pH-Wert" value={ph} unit="" />
              <GridItem
                name="Elektrische Leitfähigkeit"
                value={ec}
                unit="μS/cm"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

MeasurementsGrid.displayName = "MeasurementsGrid";

export default MeasurementsGrid;

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
  const [isFlipped, setIsFlipped] = useState(false);

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
    <motion.div
      className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-md bg-muted/40 p-4 cursor-pointer h-[14vh]"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 backface-hidden w-full h-full flex flex-col justify-between p-4"
        style={{
          rotateY: isFlipped ? 180 : 0,
          backfaceVisibility: "hidden",
        }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="z-10 flex gap-1">
          <p className="whitespace-nowrap text-sm">{name}</p>
          {labels && labels.length > 0 && labelIndex !== undefined && (
            <span className="h-fit rounded-full px-1 py-0.5 text-[8px] text-accent">
              {labels[labelIndex!]}
            </span>
          )}
        </div>
        <div className="z-10 flex max-w-0 items-baseline gap-2 text-3xl">
          {selectedValue === undefined && (
            <div className="my-1.5 h-5 animate-pulse rounded-full bg-accent" />
          )}
          {selectedValue !== undefined ? (
            <AnimatedNumber decimals={decimals}>{selectedValue}</AnimatedNumber>
          ) : null}
          <p className="text-xs">{unit}</p>
        </div>
      </motion.div>
      <motion.div
        className="absolute inset-0 backface-hidden w-full h-full flex flex-col items-center justify-center text-center bg-muted/40 p-4"
        style={{
          rotateY: isFlipped ? 0 : -180,
          backfaceVisibility: "hidden",
        }}
        initial={{ rotateY: -180 }}
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="text-lg font-bold">Informationen</p>
          <p className="text-sm">Hier stehen Informationen zu dem Phänomen.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
