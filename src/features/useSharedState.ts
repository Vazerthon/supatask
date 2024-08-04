import { Label } from "../types/types";
import useLabelStore from "./labels/useLabelStore";
import useTaskStore from "./tasks/useTaskStore";

export default function useSharedState() {
  const { tasks } = useTaskStore();
  const { labels } = useLabelStore();

  const labelsDict: Record<Label["id"], Label> = labels.reduce(
    (acc, label) => ({ ...acc, [label.id]: label }),
    {}
  );

  const unlabelledEnabled = labelsDict["unlabelled"]?.enabled;

  const filteredTasks = tasks.filter((task) => {
    const taskHasNoLabels = task.task_label.length === 0;
    return (
      (unlabelledEnabled && taskHasNoLabels) ||
      task.task_label.some((tl) => {
        return labelsDict[tl.label_id]?.enabled;
      })
    );
  });

  return {
    filteredTasks,
    labelsDict,
  };
}
