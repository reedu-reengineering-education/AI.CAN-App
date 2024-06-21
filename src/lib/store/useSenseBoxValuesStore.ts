import { create } from "zustand";

export type senseBoxDataRecord = {
  timestamp: Date;
  temperature?: number;
  ph?: number;
  turbidity?: number;
  ec?: number;
};

interface senseBoxValuesStore {
  values: senseBoxDataRecord[];
  temperature: number;
  setTemperature: (_temperature: number) => void;
  ph: number;
  setPh: (_ph: number) => void;
  turbidity: number;
  setTurbidity: (_turbidity: number) => void;
  ec: number;
  setEc: (_ec: number) => void;
  setValues: (_values: senseBoxDataRecord[]) => void;
  addValues: (_values: senseBoxDataRecord[]) => void;
  reset: () => void;
  uploadStart: Date | undefined;
  setUploadStart: (_uploadStart: Date | undefined) => void;
}

export const useSenseBoxValuesStore = create<senseBoxValuesStore>((set) => ({
  values: [],
  temperature: 0,
  ph: 0,
  turbidity: 0,
  ec: 0,
  setTemperature: (temperature) => set({ temperature }),
  setPh: (ph) => set({ ph }),
  setTurbidity: (turbidity) => set({ turbidity }),
  setEc: (ec) => set({ ec }),
  setValues: (values) => set({ values }),
  addValues: (values) =>
    set((state) => ({
      values: [...state.values, ...values],
    })),
  uploadStart: undefined,
  setUploadStart: (uploadStart) => set({ uploadStart }),
  reset: () => set({ values: [], uploadStart: undefined }),
}));
