import { Badge, Flex, FlexProps } from "@chakra-ui/react";
import { Task } from "../../types/types";
import useSharedState from "../useSharedState";

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
        <Badge
          key={label.id}
          w={4}
          h={4}
          ml={1}
          borderRadius="50%"
          backgroundColor={label.color_hex}
          alignSelf="center"
        />
      ))}
    </Flex>
  );
}
