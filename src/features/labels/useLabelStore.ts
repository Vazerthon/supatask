import { create } from "zustand";
import { Label } from "../../types/types";

interface LabelState {
  labels: Label[];
  setLabels: (labels: Label[]) => void;
  enableLabel: (labelId: string) => void;
  disableLabel: (labelId: string) => void;
}

const enableAll = (label: Label) => ({ ...label, enabled: true });

const useLabelStore = create<LabelState>((set) => ({
  labels: [],
  setLabels: (labels) => set({ labels: labels.map(enableAll) }),
  enableLabel: (labelId) =>
    set((state) => ({
      labels: state.labels.map((label) =>
        label.id === labelId ? { ...label, enabled: true } : label
      ),
    })),
  disableLabel: (labelId) =>
    set((state) => ({
      labels: state.labels.map((label) =>
        label.id === labelId ? { ...label, enabled: false } : label
      ),
    })),
}));

export default useLabelStore;
