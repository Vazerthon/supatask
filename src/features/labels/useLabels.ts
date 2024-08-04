import { useCallback } from "react";
import { supabase } from "../../supabaseClient";
import constants from "../../constants";

export default function useLabels() {
  const addLabel = useCallback(async (text: string, color: string) => {
    await supabase
      .from(constants.LABEL_TABLE)
      .insert({ text, color_hex: color });
  }, []);

  return {
    addLabel,
    createTaskLabels,
  };
}
