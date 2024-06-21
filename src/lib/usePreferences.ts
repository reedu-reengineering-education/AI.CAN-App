import { useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";

const STORAGE_KEY = "measurements";

const useMeasurements = () => {
  const [measurements, setMeasurements] = useState<any>([]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      setMeasurements(value ? JSON.parse(value) : []);
    };

    fetchMeasurements();
  }, []);

  const saveMeasurement = async (data: any) => {
    try {
      const existingData = measurements;
      const updatedData = [...existingData, data];
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(updatedData),
      });
      setMeasurements(updatedData);
    } catch (error) {
      console.error("Error saving measurement", error);
    }
  };

  return { measurements, saveMeasurement };
};

export default useMeasurements;
