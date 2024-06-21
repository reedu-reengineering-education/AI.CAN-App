"use client";

import {
  MapProps,
  MapRef,
  Map as ReactMap,
  GeolocateControl,
  Marker,
  Popup,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { forwardRef, useState, useRef, useEffect } from "react";
import {
  getBoxesByGrouptag,
  getSensorDataByBoxId,
} from "@/lib/api/openSenseMapClient";
import { useMeasurementStore } from "@/lib/store/useMeasurementStore";
import { Button } from "../ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

const Map = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    const basemap = "streets-v2";
    const { toast } = useToast();
    const [selectedMarker, setSelectedMarker] = useState({
      id: 1,
      longitude: 14.31072700442259,
      latitude: 53.033753991393674,
      color: "red",
    });

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
      const fetchMarkers = async () => {
        try {
          const boxes = await getBoxesByGrouptag("AI.CAN");
          console.log(boxes);
          const newMarkers = boxes.map((box: any) => ({
            name: box.name,
            id: box._id,
            longitude: box.currentLocation.coordinates[0],
            latitude: box.currentLocation.coordinates[1],
            color: "red", // Du kannst hier die Farbe anpassen
          }));
          setMarkers(newMarkers);
        } catch (error) {
          console.error("Error fetching boxes:", error);
        }
      };

      fetchMarkers();
    }, []);

    const [markers, setMarkers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupLocation, setPopupLocation] = useState({
      lng: 0,
      lat: 0,
    });
    const fetchMarkers = async () => {
      try {
        const boxes = await getBoxesByGrouptag("AI.CAN");
        console.log(boxes);
        const newMarkers = boxes.map((box: any) => ({
          name: box.name,
          id: box._id,
          longitude: box.currentLocation.coordinates[0],
          latitude: box.currentLocation.coordinates[1],
          color: "red", // Du kannst hier die Farbe anpassen
        }));
        toast({ title: "Marker aktualisiert", duration: 1000 });
        setMarkers(newMarkers);
      } catch (error) {
        console.error("Error fetching boxes:", error);
      }
    };
    const setValueByTitle = (title: String, setValue: any, sensors: any) => {
      const sensor = sensors.find((sensor: any) => sensor.title === title);
      if (sensor && sensor.lastMeasurement) {
        setValue(Number(sensor.lastMeasurement.value));
      }
    };
    const handleMarkerClick = (marker: any, name: any, index: number) => {
      console.log(marker);

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

    return (
      <div style={{ position: "relative" }}>
        <Button
          onClick={fetchMarkers}
          variant="outline"
          style={{
            position: "absolute",
            bottom: 40,
            left: 10,
            zIndex: 1,
          }}
        >
          <RefreshCwIcon />
        </Button>
        {/* @ts-ignore */}
        <ReactMap
          mapStyle={
            mapStyle ||
            `https://api.maptiler.com/maps/${basemap}/style.json?key=DT8RRRX6sOuzQrcuhKuE`
          }
          ref={ref}
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
          {markers.map((marker: any, index) => (
            <Marker
              key={index}
              longitude={marker.longitude}
              latitude={marker.latitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(marker.id, marker.name, index);
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
