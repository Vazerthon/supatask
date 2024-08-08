import {
  Checkbox,
  Flex,
  Grid,
  ListItem,
  ListItemProps,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Task } from "../../../types/types";
import useTaskStore from "../useTaskStore";
import useTasks from "./useTasks";
import TaskLabelList from "../../labels/TaskLabelList";
import TaskListItemMenu from "./TaskListItemMenu";

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
  const completedAtDateString = completionForCurrentPeriod?.completed_at;
  const completionString =
    completedAtDateString &&
    `completed: ${format(completedAtDateString, "iii do MMM")}`;

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
        <Grid templateColumns="auto 1fr 40px" gap={2}>
          <Flex direction="column" ml={1} justifyContent="center">
            <Text alignContent="center">{item.title}</Text>
            {completionString && (
              <Text fontSize="sm" color="gray.600">
                {completionString}
              </Text>
            )}
          </Flex>

          <TaskLabelList task={item} flexDirection="row-reverse" />
          <TaskListItemMenu task={item} />
        </Grid>
      </Checkbox>
    </ListItem>
  );
}
