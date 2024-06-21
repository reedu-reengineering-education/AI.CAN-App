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
import { useSwiper } from "swiper/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserIcon } from "lucide-react";

export default function PositionSelect({
  updateFormData,
}: {
  updateFormData: any;
}) {
  const swiper = useSwiper();
  const [coordinates, setCoordinates] = useState({
    latitude: 53.041959805718506,
    longitude: 14.326863173855571,
  });
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    updateFormData("position", coordinates);
  }, [coordinates]);

  const handleGeolocate = (position: any) => {
    console.log(position);
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

  return (
    <div className="flex flex-col h-screen justify-center ">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">Standort bestimmen</h1>
        <p className="text-gray-600 text-center">
          Zuerst müssen wir deinen Standort bestimmen. Klicke auf den Knopf um
          das GPS deines Handys zu nehmen, oder wähle auf der Karte einen
          Standort aus.
        </p>
        <ReactMap
          ref={mapRef}
          mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=DT8RRRX6sOuzQrcuhKuE`}
          style={{
            width: "100%",
            height: "40vh",
          }}
          initialViewState={{
            zoom: 10,
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
          }}
          onClick={handleMapClick}
        >
          <GeolocateControl
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
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={() => swiper.slidePrev()}>Zurück</Button>
        <Button onClick={() => swiper.slideNext()}>Weiter</Button>
      </div>
    </div>
  );
}
