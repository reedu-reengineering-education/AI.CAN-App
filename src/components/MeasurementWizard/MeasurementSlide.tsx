import { useSwiper } from "swiper/react";
import { Button } from "../ui/button";
import Image from "next/image";
import WizardSlide from "./WizardSlide";
import waterDrop from "../../../public/waterDrop.png";
import {
  BluetoothIcon,
  MousePointerClickIcon,
  PointerIcon,
} from "lucide-react";
import useSenseBox from "@/lib/useSenseBox";
import AnimatedNumber from "@/components/ui/animated-number";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import MeasurementDialog from "./MeasurementDialog";

export default function MeasurementSlide({
  updateFormData,
  formData,
}: {
  updateFormData: any;
  formData: any;
}) {
  const swiper = useSwiper();

  const { connect, isConnected, disconnect } = useSenseBox();

  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">
          Messungen durchführen
        </h1>
        <p className="text-gray-600 text-center">
          Lass uns nun die Messungen von Wassertemperatur, pH-Wert und
          elektrischer Leitfähigkeit durchführen.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Dialog>
          <DialogTrigger>
            <GridItem
              name="Wassertemperatur"
              value={formData.temperature}
              unit="°C"
            />
          </DialogTrigger>
          <DialogContent>
            <MeasurementDialog
              updateFormData={updateFormData}
              name="Wassertemperatur"
              unit="°C"
            />
            <DialogFooter className="flex justify-end p-5">
              <DialogClose asChild>
                <Button>Übernehmen</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <GridItem name="ph-Wert" value={formData.ph} unit="" />
          </DialogTrigger>
          <DialogContent>
            <MeasurementDialog
              updateFormData={updateFormData}
              name="ph-Wert"
              unit=""
            />
            <DialogFooter className="flex justify-end p-5">
              <DialogClose asChild>
                <Button>Übernehmen</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <GridItem
              name="Elektrische Leitfähigkeit"
              value={formData.conductivity}
              unit="µS/cm"
            />
          </DialogTrigger>
          <DialogContent>
            <MeasurementDialog
              updateFormData={updateFormData}
              name="Elektrische Leitfähigkeit"
              unit="µS/cm"
            />
            <DialogFooter className="flex justify-end p-5">
              <DialogClose asChild>
                <Button>Übernehmen</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={() => swiper.slidePrev()}>Zurück</Button>
        <Button onClick={() => swiper.slideNext()}>Weiter</Button>
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
