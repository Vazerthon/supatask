import {
  Checkbox,
  Grid,
  ListItem,
  ListItemProps,
  Text,
} from "@chakra-ui/react";
import { Task } from "../../../types/types";
import useTaskStore from "../useTaskStore";
import useTasks from "./useTasks";
import TaskLabelList from "../../labels/TaskLabelList";

interface TaskListItemProps extends ListItemProps {
  item: Task;
}

export default function TaskListItem({
  item,
  ...listItemProps
}: TaskListItemProps) {
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
    <ListItem
      listStyleType="none"
      py={2}
      px={1}
      borderRadius="xs"
      {...listItemProps}
    >
      <Checkbox
        isChecked={isChecked}
        onChange={handleCheckboxChange}
        w="100%"
        sx={{
          // is there a good way to do this? I dunno
          ".chakra-checkbox__label": {
            width: "100%",
          },
        }}
      >
        <Grid templateColumns="auto 1fr" gap={2}>
          <Text ml={1}>{item.title}</Text>
          <TaskLabelList task={item} flexDirection="row-reverse" />
        </Grid>
      </Checkbox>
    </ListItem>
  );
}
