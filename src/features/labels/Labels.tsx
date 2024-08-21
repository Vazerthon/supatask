import { useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useSetLabels, useAddLabel } from "./useLabelStore";
import { supabase } from "../../supabaseClient";
import constants from "../../constants";
import { Label } from "../../types/types";

export default function Labels() {
  const setLabels = useSetLabels();
  const addLabel = useAddLabel();

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

  useEffect(() => {
    const handleLabelInserts = (
      payload: RealtimePostgresChangesPayload<Label>
    ) => {
      if (payload.eventType === "INSERT" && payload.new) {
        addLabel({ ...payload.new, enabled: true });
      }
    };
    const channel = "label-changes";
    const subscribeToLabels = () => {
      supabase
        .channel(channel)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: constants.LABEL_TABLE,
          },
          handleLabelInserts
        )
        .subscribe();
    };
    const unsubscribe = () => {
      supabase.channel(channel).unsubscribe();
    };
    subscribeToLabels();
    return unsubscribe;
  }, [addLabel, setLabels]);

  return <></>;
}
