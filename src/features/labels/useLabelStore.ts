import { create } from "zustand";
import { useCallback } from "react";
import { supabase } from "../../supabaseClient";
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

export const useSetLabels = () => useLabelStore((state) => state.setLabels);
export const useAddLabel = () => useLabelStore((state) => state.addLabel);
export const useLabelList = () => useLabelStore((state) => state.labels);
export const useEnableLabel = () => useLabelStore((state) => state.enableLabel);
export const useDisableLabel = () =>
  useLabelStore((state) => state.disableLabel);
export const useEnableAllLabels = () =>
  useLabelStore((state) => state.enableAll);
export const useDisableAllLabels = () =>
  useLabelStore((state) => state.disableAll);

export const useLabelsAsDict = (): Record<Label["id"], Label> => {
  const labels = useLabelList();
  return labels.reduce((acc, label) => ({ ...acc, [label.id]: label }), {});
};

export function useLabelsApi() {
  const addLabel = useCallback(async (text: string, color: string) => {
    await supabase
      .from(constants.LABEL_TABLE)
      .insert({ text, color_hex: color });
  }, []);

  return {
    addLabel,
  };
}
