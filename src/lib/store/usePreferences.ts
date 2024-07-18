import { useState, useEffect, useCallback } from "react";
import { Preferences } from "@capacitor/preferences";

interface UsePreferencesReturnType {
  value: string | null;
  saveValue: (newValue: string) => Promise<void>;
  removeValue: () => Promise<void>;
  getValue: () => Promise<string | null>;
  getAllValues: () => Promise<string[] | null>;
}

const usePreferences = (key: string): UsePreferencesReturnType => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const loadValue = async () => {
      const { value } = await Preferences.get({ key });
      setValue(value);
    };

    loadValue();
  }, [key]);

  const saveValue = useCallback(
    async (newValue: string) => {
      await Preferences.set({
        key,
        value: JSON.stringify(newValue),
      });
      setValue(newValue);
    },
    [key]
  );

  const removeValue = useCallback(async () => {
    await Preferences.remove({ key });
    setValue(null);
  }, [key]);

  const getValue = useCallback(async () => {
    const { value } = await Preferences.get({ key });
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error("Invalid JSON object:", error);
      }
    }
    return null;
  }, [key]);

  const getAllValues = useCallback(async (): Promise<string[] | null> => {
    const { value } = await Preferences.get({ key });
    const { keys } = await Preferences.keys();

    const values: string[] = await Promise.all(
      keys.map(async (key) => {
        // check if key is a timestamp (starts with a number)
        if (key.match(/^\d/)) {
          const { value } = await Preferences.get({ key });
          if (value) {
            try {
              return JSON.parse(value);
            } catch (error) {
              console.log(error);
            }
          }

          // check if value exists and is a valid json object
        }
        return null;
      })
    );
    return values.filter((value) => value !== null);
  }, [key]);

  return {
    value,
    saveValue,
    removeValue,
    getValue,
    getAllValues,
  };
};

export default usePreferences;
