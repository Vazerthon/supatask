import { Button, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { format } from "date-fns";
import { supabase } from "../../../supabaseClient";
import { useSession } from "../../../state/useSessionStore";
import icons from "../../../icons";

export default function ExportData() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  async function handleExport() {
    setIsLoading(true);
    try {
      const [tasksResult, labelsResult] = await Promise.all([
        supabase.from("task").select("*, completion(*), task_label(*)"),
        supabase.from("label").select("*"),
      ]);

      const data = {
        exportedAt: new Date().toISOString(),
        tasks: tasksResult.data ?? [],
        labels: labelsResult.data ?? [],
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const filename = `supatask-export-${format(new Date(), "yyyy-MM-dd")}.json`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    } finally {
      setIsLoading(false);
    }
  }

  if (!session) return null;

  return (
    <Button
      onClick={handleExport}
      isLoading={isLoading}
      leftIcon={<Icon as={icons.Download} />}
    >
      Export data
    </Button>
  );
}
