import {
  BackgroundGeolocationPlugin,
  Location,
} from "@capacitor-community/background-geolocation";
import { registerPlugin } from "@capacitor/core";
import { useEffect, useRef, useState } from "react";

import { KeepAwake } from "@capacitor-community/keep-awake";
import { SenseBoxDataParser } from "./SenseBoxDataParser";
import {
  senseBoxDataRecord,
  useSenseBoxValuesStore,
} from "./store/useSenseBoxValuesStore";
import useBLEDevice from "./useBLE";

import { PushNotifications } from "@capacitor/push-notifications";
import { toast } from "@/components/ui/use-toast";
import { time } from "console";

const BLE_SENSEBOX_SERVICE = "CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84";
const BLE_TEMPERATURE_CHARACTERISTIC = "2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8";

const BLE_PH_CHARACTERISTIC = "772DF7EC-8CDC-4EA9-86AF-410ABE0BA257";
const BLE_EC_CHARACTERISTIC = "7E14E070-84EA-489F-B45A-E1317364B979";
const BLE_TURBIDITY_CHARACTERISTIC = "8EDF8EBB-1246-4329-928D-EE0C91DB2389";

const _BLE_CONFIG_SERVICE = "29BD0A85-51E4-4D3C-914E-126541EB2A5E";
const _BLE_CONFIG_CHARACTERISTIC = "60B1D5CE-3539-44D2-BB35-FF2DAABE17FF";

export const BackgroundGeolocation =
  registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

/**
 * Parses the data received from the SenseBox and returns an array of values.
 * @param data - The data received from the SenseBox as a DataView.
 * @returns An array of values parsed from the data.
 */
function parsePackages(data: DataView) {
  const packages = data.byteLength / 4;

  let valueRecords: number[] = [];
  for (let i = 0; i < packages; i++) {
    valueRecords.push(data.getFloat32(i * 4, true));
  }

  return valueRecords;
}

export default function useSenseBox(timestampInterval: number = 500) {
  const { isConnected, connect, listen, send, disconnect } = useBLEDevice({
    namePrefix: "senseBox",
  });
  const { setValues, setTemperature, setPh, setEc, setTurbidity } =
    useSenseBoxValuesStore();
  const values = useSenseBoxValuesStore((state) => state.values);
  const useSenseBoxGPSRef = useRef<boolean>();

  const dataParser = SenseBoxDataParser.getInstance(timestampInterval);

  const [watcherId, setWatcherId] = useState<string>();

  const [location, setLocation] = useState<Location>();
  const locationRef = useRef<Location>();
  locationRef.current = location;

  useEffect(() => {
    if (watcherId)
      BackgroundGeolocation.removeWatcher({ id: watcherId }).then(() =>
        setWatcherId(undefined)
      );
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      KeepAwake.keepAwake();
      return;
    }

    KeepAwake.isKeptAwake().then((isKeptAwake) => {
      if (isKeptAwake) {
        KeepAwake.allowSleep();
      }
    });
  }, [isConnected]);

  // listen to the BLE characteristics
  useEffect(() => {
    const dataToStore = {
      temperature: 0,
      ph: 0,
      turbidity: 0,
      ec: 0,
      timestamp: new Date(),
    };
    listen(BLE_SENSEBOX_SERVICE, BLE_TEMPERATURE_CHARACTERISTIC, (data) => {
      const [temperature] = parsePackages(data);
      setTemperature(temperature);
      pushDataToProcess({ temperature });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_PH_CHARACTERISTIC, (data) => {
      const [ph] = parsePackages(data);
      setPh(ph);
      pushDataToProcess({ ph });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_EC_CHARACTERISTIC, (data) => {
      const [ec] = parsePackages(data);
      setEc(ec);
      pushDataToProcess({ ec });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_TURBIDITY_CHARACTERISTIC, (data) => {
      const [turbidity] = parsePackages(data);
      setTurbidity(turbidity);
      pushDataToProcess({ turbidity });
    });
  }, [isConnected]);

  const pushDataToProcess = (record: Omit<senseBoxDataRecord, "timestamp">) => {
    let data = record;

    dataParser.pushData(data);
  };

  return {
    isConnected,
    connect,
    values,
    disconnect,
    send,
  };
}
