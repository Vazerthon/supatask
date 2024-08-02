import { useEffect } from "react";
import useLabelStore from "./useLabelStore";
import { supabase } from "../../supabaseClient";
import constants from "../../constants";

export default function Labels() {
  const { setLabels } = useLabelStore();

  useEffect(() => {
    const getLabels = () => {
      supabase
        .from(constants.LABEL_TABLE)
        .select()
        .then(({ data }) => {
          setLabels(data || []);
        });
    };
    getLabels();
  }, [setLabels]);

  return <></>;
}
