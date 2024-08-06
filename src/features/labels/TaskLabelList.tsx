import { Flex, FlexProps } from "@chakra-ui/react";
import { Task } from "../../types/types";
import useSharedState from "../useSharedState";
import LabelBadge from "./components/LabelBadge";

interface TaskLabelListProps extends FlexProps {
  task: Task;
}

export default function TaskLabelList({
  task,
  ...flexProps
}: TaskLabelListProps) {
  const { labelsDict } = useSharedState();

  const taskLabels = task.task_label.map(
    (label) => labelsDict[label.label_id]!
  );

  return (
    <Flex {...flexProps}>
      {taskLabels.map((label) => (
        <LabelBadge label={label} key={label.id} ml={1} />
      ))}
    </Flex>
  );
}
