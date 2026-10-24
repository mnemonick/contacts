import { create } from "zustand";

interface GlobalStore {
  disconnected: boolean;
  error: boolean;
  setDisconnected: (value: boolean) => void;
}

export default create<GlobalStore>((set) => ({
  disconnected: false,
  error: false,
  setDisconnected: (value: boolean) => set({ disconnected: value })
}));
