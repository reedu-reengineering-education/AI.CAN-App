import React, { useState, useRef, useEffect } from "react";
import {
  MapProps,
  MapRef,
  Map as ReactMap,
  GeolocateControl,
  Marker,
  Popup,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "../ui/button";
import { useSwiper, useSwiperSlide } from "swiper/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bluetooth, PointerIcon, UserIcon } from "lucide-react";
import useSenseBox from "@/lib/useSenseBox";
import { BluetoothIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import MeasurementDialog from "./MeasurementDialog";
import AnimatedNumber from "@/components/ui/animated-number";
import { useRouter } from "next/navigation";

export default function RecordMeasurement({
  updateFormData,
  formData,
}: {
  updateFormData: any;
  formData: any;
}) {
  const swiper = useSwiper();
  const router = useRouter();
  const [coordinates, setCoordinates] = useState({
    latitude: 53.041959805718506,
    longitude: 14.326863173855571,
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const mapRef = useRef<MapRef>(null);
  const geoControlRef = useRef<maplibregl.GeolocateControl>();
  const { connect, isConnected, disconnect } = useSenseBox();

  useEffect(() => {
    geoControlRef.current?.trigger();
  }, [geoControlRef.current]);

  useEffect(() => {
    updateFormData("position", coordinates);
  }, [coordinates]);

  const handleConnect = async () => {
    setButtonDisabled(true);
    await connect();
    setButtonDisabled(false);
  };

  const handleDisconnect = async () => {
    setButtonDisabled(false);
    await disconnect();
  };

  const handleGeolocate = (position: any) => {
    const { latitude, longitude } = position.coords;
    setCoordinates({ latitude, longitude });
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [longitude, latitude], essential: true });
    }
  };

  const handleMarkerDragEnd = (event: any) => {
    const { lngLat } = event;
    setCoordinates({ latitude: lngLat.lat, longitude: lngLat.lng });
  };

  const handleMapClick = (event: any) => {
    const { lngLat } = event;
    setCoordinates({ latitude: lngLat.lat, longitude: lngLat.lng });
  };

  const handleCancel = () => {
    router.push("/map");
  };

  return (
    <div className="flex flex-col h-screen justify-center mt-4 ">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserIcon />
          <div>
            <p className="font-medium">Dein Standort</p>
            {coordinates.latitude && coordinates.longitude ? (
              <p className="text-sm text-muted-foreground">
                {coordinates.latitude.toFixed(4)}° N,{" "}
                {coordinates.longitude.toFixed(4)}° W
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Standort nicht festgelegt
              </p>
            )}
          </div>
        </div>
        <ReactMap
          ref={mapRef}
          mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=DT8RRRX6sOuzQrcuhKuE`}
          style={{
            width: "100%",
            height: "35vh",
          }}
          initialViewState={{
            zoom: 10,
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
          }}
          onClick={handleMapClick}
        >
          <GeolocateControl
            // @ts-ignore
            ref={geoControlRef}
            position="bottom-right"
            onGeolocate={handleGeolocate}
          />
          {coordinates.latitude && coordinates.longitude && (
            <Marker
              style={{ zIndex: 1000 }}
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </ReactMap>
      </div>
      <div className="flex flex-col gap-4">
        <Dialog>
          <DialogTrigger disabled={isConnected}>
            <GridItem
              name="Wassertemperatur"
              value={formData.temperature}
              unit="°C"
              isConnected={isConnected}
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
            <GridItem
              name="ph-Wert"
              value={formData.ph}
              unit=""
              isConnected={isConnected}
            />
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
              isConnected={isConnected}
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
        <Button onClick={handleCancel}>Abbrechen</Button>
        <div className="flex justify-center ">
          {!isConnected ? (
            <Button disabled={buttonDisabled} onClick={() => handleConnect()}>
              <BluetoothIcon />
              Scannen
            </Button>
          ) : (
            <Button onClick={() => handleDisconnect()}>
              <BluetoothIcon />
              Trennen
            </Button>
          )}
        </div>

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
  isConnected,
  decimals = 2,
}: {
  name: string;
  value: number | (number | undefined)[] | undefined;
  labels?: string[];
  unit: string;
  isConnected: boolean;
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
        {isConnected ? (
          selectedValue !== undefined && selectedValue !== 0 ? (
            <div className="flex">
              <AnimatedNumber decimals={decimals}>
                {selectedValue}
              </AnimatedNumber>
              <p className="text-xs">{unit}</p>
            </div>
          ) : (
            <div className="flex gap-4">
              <PointerIcon />
              <p className="text-xs">Klicken um Messung durchzuführen</p>
            </div>
          )
        ) : (
          <div className="flex gap-4">
            <BluetoothIcon />{" "}
            <p className="text-xs">Verbinde dich mit dem Gerät</p>
          </div>
        )}
      </div>
    </div>
  );
}
