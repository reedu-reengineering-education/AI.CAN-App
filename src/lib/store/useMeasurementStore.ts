import { create } from "zustand";

export type measurementRecord = {
  name: string;
  timestamp: Date;
  temperatureHistoric?: number;
  phHistoric?: number;
  turbidityHistoric?: number;
  ecHistoric?: number;
  geruch?: string;
  geschmack?: string;
  klarheit?: string;
  wetter?: string;
  wind?: string;
  farbe?: string;
  development?: string;
};

interface measurementsRecord {
  values: measurementRecord[];
  name: string;
  timestampHistoric?: Date;
  temperatureHistoric: number;
  setTemperature: (_temperature: number) => void;
  phHistoric: number;
  setPh: (_ph: number) => void;
  turbidityHistoric: number;
  setTurbidity: (_turbidity: number) => void;
  ecHistoric: number;
  setEc: (_ec: number) => void;
  geruch: string;
  setGeruch: (_geruch: string) => void;
  geschmack: string;
  setGeschmack: (_geschmack: string) => void;
  klarheit: string;
  setKlarheit: (_klarheit: string) => void;
  setTimeHistoric: (_timestamp: Date) => void;
  setName: (_name: string) => void;
  wetter: string;
  wind: string;
  farbe: string;
  development: string;
  setWetter: (_wetter: string) => void;
  setWind: (_wind: string) => void;
  setFarbe: (_farbe: string) => void;
  setDevelopment: (_development: string) => void;
}

export const useMeasurementStore = create<measurementsRecord>((set) => ({
  values: [],
  name: "",
  timestampHistoric: new Date(0),
  temperatureHistoric: 0,
  phHistoric: 0,
  turbidityHistoric: 0,
  ecHistoric: 0,
  geruch: "",
  geschmack: "",
  klarheit: "",
  wetter: "",
  wind: "",
  farbe: "",
  development: "",
  setDevelopment: (development) => set({ development }),
  setWetter: (wetter) => set({ wetter }),
  setWind: (wind) => set({ wind }),
  setFarbe: (farbe) => set({ farbe }),
  setTimeHistoric: (timestampHistoric) => set({ timestampHistoric }),
  setTemperature: (temperatureHistoric) => set({ temperatureHistoric }),
  setPh: (phHistoric) => set({ phHistoric }),
  setTurbidity: (turbidityHistoric) => set({ turbidityHistoric }),
  setEc: (ecHistoric) => set({ ecHistoric }),
  setGeruch: (geruch) => set({ geruch }),
  setGeschmack: (geschmack) => set({ geschmack }),
  setKlarheit: (klarheit) => set({ klarheit }),
  setName: (name) => set({ name }),
}));
