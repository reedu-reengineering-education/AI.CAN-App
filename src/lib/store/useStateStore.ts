import { create } from "zustand";

interface StateStoreInterface {
  offline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useStateStore = create<StateStoreInterface>((set) => ({
  offline: false,
  setOffline: (offline) => set({ offline }),
}));
