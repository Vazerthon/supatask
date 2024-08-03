import { create } from "zustand";
import { Label } from "../../types/types";

interface LabelState {
  labels: Label[];
  setLabels: (labels: Label[]) => void;
  enableLabel: (labelId: string) => void;
  disableLabel: (labelId: string) => void;
  addLabel: (label: Label) => void;
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
  addLabel: (label) => set((state) => ({ labels: [...state.labels, label] })),
}));

export default useLabelStore;
