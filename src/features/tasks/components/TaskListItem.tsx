import { Checkbox, Grid, ListItem, Text } from "@chakra-ui/react";
import { Task } from "../../../types/types";
import useTaskStore from "../useTaskStore";
import useTasks from "./useTasks";
import TaskLabelList from "../../labels/TaskLabelList";

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
        <Grid templateColumns="auto 1fr" gap={2}>
          <Text ml={1}>{item.title}</Text>
          <TaskLabelList task={item} />
        </Grid>
      </Checkbox>
    </ListItem>
  );
}
