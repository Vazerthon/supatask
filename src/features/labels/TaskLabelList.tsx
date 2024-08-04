import { Badge, Flex, FlexProps } from "@chakra-ui/react";
import useLabelStore from "./useLabelStore";
import { Label, Task } from "../../types/types";

interface TaskLabelListProps extends FlexProps {
  task: Task;
}

export default function TaskLabelList({
  task,
  ...flexProps
}: TaskLabelListProps) {
  const { labels } = useLabelStore();

  const labelsDict: Record<Label["id"], Label> = labels.reduce(
    (acc, label) => ({ ...acc, [label.id]: label }),
    {}
  );
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
