import { Checkbox, ListItem, Text } from "@chakra-ui/react";
import { Task } from "../../../types/types";
import useTaskStore from "../../../hooks/useTaskStore";
import useTasks from "./useTasks";

type TaskListItemProps = {
  item: Task;
};

export default function TaskListItem({ item }: TaskListItemProps) {
  const { frequencyPeriod } = useTaskStore();
  const { toggleTaskCompletion } = useTasks();

  const completionForCurrentPeriod = item.completion.find(
    (c) => c.period === frequencyPeriod[item.frequency]
  );

  const isChecked = completionForCurrentPeriod?.complete || false;

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await toggleTaskCompletion(
      item,
      event.target.checked,
      completionForCurrentPeriod
    );
  };

  return (
    <ListItem listStyleType="none" mt={4}>
      <Checkbox
        width="100%"
        isChecked={isChecked}
        onChange={handleCheckboxChange}
      >
        <Text ml={1}>{item.title}</Text>
      </Checkbox>
    </ListItem>
  );
}
