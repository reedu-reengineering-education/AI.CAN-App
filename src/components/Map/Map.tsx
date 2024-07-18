"use client";

import {
  MapProps,
  MapRef,
  Map as ReactMap,
  GeolocateControl,
  Marker,
  Popup,
  useMap,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { forwardRef, useState, useEffect, useRef } from "react";
import {
  getBoxesByGrouptag,
  getSensorDataByBoxId,
} from "@/lib/api/openSenseMapClient";
import { useMeasurementStore } from "@/lib/store/useMeasurementStore";
import { Button } from "../ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import usePreferences from "@/lib/store/usePreferences";

interface MarkerData {
  name: string;
  id: string;
  longitude: number;
  latitude: number;
  color: string;
}

const Map = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    const basemap = "streets-v2";
    const { toast } = useToast();
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [markersOffline, setMarkersOffline] = useState<MarkerData[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(
      null
    );
    const { getAllValues } = usePreferences("measurements");
    const {
      setTemperature,
      setPh,
      setTurbidity,
      setEc,
      setGeruch,
      setGeschmack,
      setKlarheit,
      setWetter,
      setWind,
      setFarbe,
      setDevelopment,
      setTimeHistoric,
      setName,
    } = useMeasurementStore();

    useEffect(() => {
      fetchMarkers();
    }, []);

    const setValueByTitle = (title: String, setValue: any, sensors: any) => {
      const sensor = sensors.find((sensor: any) => sensor.title === title);
      if (sensor && sensor.lastMeasurement) {
        setValue(Number(sensor.lastMeasurement.value));
      }
    };

    const fetchMarkers = async () => {
      try {
        const boxes = await getBoxesByGrouptag("AI.CAN");
        const newMarkersOnline: MarkerData[] = boxes.map((box: any) => ({
          name: box.name,
          id: box._id,
          longitude: box.currentLocation.coordinates[0],
          latitude: box.currentLocation.coordinates[1],
          color: "#16A34A",
        }));
        setMarkers(newMarkersOnline);

        const measurementsOffline = await getAllValues();
        // filter all markers where box is not null

        if (!measurementsOffline) return;
        // const boxesOffline = measurementsOffline.filter(
        //   (measurement: any) => measurement.box === null
        // );
        const newMarkersOffline: MarkerData[] = measurementsOffline.map(
          (measurement: any) => ({
            name: measurement.time,
            id: measurement.time,
            longitude: measurement.position.longitude,
            latitude: measurement.position.latitude,
            color: "#EF4444",
            offline: true,
          })
        );
        console.log(newMarkersOffline);
        setMarkersOffline(newMarkersOffline);
      } catch (error) {
        console.error("Error fetching boxes:", error);
      }
    };
    const handleMarkerClick = (marker: any, name: any, index: number) => {
      getSensorDataByBoxId(marker).then((data) => {
        const sensors = data.sensors;
        setName(name);
        setValueByTitle("Wassertemperatur", setTemperature, sensors);
        setValueByTitle("pH-Wert", setPh, sensors);
        setValueByTitle("Elektrische Leitfähigkeit", setEc, sensors);
        setValueByTitle("Windstärke", setWind, sensors);
        setValueByTitle("Wetter", setWetter, sensors);
        setValueByTitle("Geruch", setGeruch, sensors);
        setValueByTitle("Färbung", setFarbe, sensors);
        setValueByTitle("Bebauungsgrad", setDevelopment, sensors);
      });
    };

    const handleOfflineMarkerClick = async (
      marker: any,
      name: any,
      index: number
    ) => {
      const measurementsOffline = await getAllValues();
      if (!measurementsOffline) return;
      const measurement: any = measurementsOffline.find(
        (measurement: any) => measurement.time === marker
      );
      console.log(measurement);
      setName(measurement.time);
      setTemperature(measurement.temperature);
      setPh(measurement.ph);
      setTurbidity(measurement.turbidity);
      setEc(measurement.conductivity);
      setGeruch(measurement.geruch);
      setGeschmack(measurement.geschmack);
      setKlarheit(measurement.klarheit);
      setWetter(measurement.wetter);
      setWind(measurement.wind);
      setFarbe(measurement.farbe);
      setDevelopment(measurement.development);
      setTimeHistoric(measurement.time);
    };

    return (
      <div style={{ position: "relative" }}>
        {/* @ts-ignore */}
        <ReactMap
          ref={ref}
          mapStyle={
            mapStyle ||
            `https://api.maptiler.com/maps/${basemap}/style.json?key=DT8RRRX6sOuzQrcuhKuE`
          }
          style={{
            width: "100vw",
            height: "53vh",
          }}
          initialViewState={{
            zoom: 12,
            longitude: 14.326863173855571,
            latitude: 53.041959805718506,
          }}
          {...props}
        >
          <GeolocateControl position="bottom-right" />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              longitude={marker.longitude}
              latitude={marker.latitude}
              color={marker.color}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(marker.id, marker.name, index);
              }}
            />
          ))}
          {markersOffline.map((marker, index) => (
            <Marker
              key={index}
              longitude={marker.longitude}
              latitude={marker.latitude}
              color={marker.color}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleOfflineMarkerClick(marker.id, marker.name, index);
              }}
            />
          ))}
          {children}
        </ReactMap>
      </div>
    );
  }
);

Map.displayName = "Map";

export default Map;
