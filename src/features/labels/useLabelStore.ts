import { create } from "zustand";
import { Label } from "../../types/types";
import constants from "../../constants";

interface LabelState {
  labels: Label[];
  setLabels: (labels: Label[]) => void;
  enableLabel: (labelId: string) => void;
  disableLabel: (labelId: string) => void;
  addLabel: (label: Label) => void;
  enableAll: () => void;
  disableAll: () => void;
}

const enableAll = (label: Label) => ({ ...label, enabled: true });
const disableAll = (label: Label) => ({ ...label, enabled: false });

const useLabelStore = create<LabelState>((set) => ({
  labels: [],
  setLabels: (labels) =>
    set({
      labels: [
        {
          id: constants.UNLABELLED_ITEM_ID,
          text: "Unlabelled",
          color_hex: "#ffffff",
          enabled: true,
          user_id: "",
        },
        ...labels.map(enableAll),
      ],
    }),
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
  enableAll: () => set((state) => ({ labels: state.labels.map(enableAll) })),
  disableAll: () => set((state) => ({ labels: state.labels.map(disableAll) })),
}));

export default useLabelStore;
