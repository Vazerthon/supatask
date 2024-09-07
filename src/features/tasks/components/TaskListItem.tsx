import {
  Checkbox,
  Flex,
  Grid,
  ListItem,
  ListItemProps,
  Text,
} from "@chakra-ui/react";
import { Task } from "../../../types/types";
import TaskLabelList from "../../labels/TaskLabelList";
import TaskListItemMenu from "./TaskListItemMenu";
import {
  countDaysToNow,
  formatShortDate,
  maxDate,
} from "../../../date-helpers";
import { useTasksApi } from "../useTaskStore";

interface TaskListItemProps extends ListItemProps {
  item: Task;
}

export default function TaskListItem({
  item,
  ...listItemProps
}: TaskListItemProps) {
  const { toggleTaskCompletion } = useTasksApi();

  const isChecked = item.completionForCurrentPeriod?.complete || false;
  const completedAtDateString = item.completionForCurrentPeriod?.completed_at;
  const completionString =
    completedAtDateString &&
    `completed: ${formatShortDate(completedAtDateString)}`;

  const distanceFromLastCompletion = () => {
    const completionDates = item.completion
      .map((c) => (c.complete ? c.completed_at : null))
      .filter((d) => d !== null);
    const lastCompletionDate = maxDate(completionDates);
    const distance = lastCompletionDate
      ? countDaysToNow(lastCompletionDate)
      : null;
    return distance && distance > 0
      ? `last completed ${distance} day${distance === 1 ? "" : "s"} ago`
      : null;
  };

  const completionLabel = completionString || distanceFromLastCompletion();

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await toggleTaskCompletion(
      item,
      event.target.checked,
      item.completionForCurrentPeriod
    );
  };

  return (
    <ListItem
      listStyleType="none"
      py={2}
      px={1}
      borderRadius="xs"
      display="flex"
      {...listItemProps}
    >
      <Checkbox
        ml={2}
        mr={2}
        isChecked={isChecked}
        onChange={handleCheckboxChange}
        sx={{
          // is there a good way to do this? I dunno
          ".chakra-checkbox__label": {
            width: "100%",
          },
        }}
        aria-label={`mark complete - ${item.title}`}
      />
      <Flex flexDirection="column" w="100%">
        <Grid
          w="100%"
          templateAreas={`"task label-menu"`}
          gridTemplateColumns="1fr auto"
          gap={2}
        >
          <Text gridArea="task" alignContent="center" noOfLines={2}>
            {item.title}
          </Text>

          <Flex gridArea="label-menu">
            <TaskLabelList task={item} />
            <TaskListItemMenu
              task={item}
              completionForCurrentPeriod={item.completionForCurrentPeriod}
            />
          </Flex>
        </Grid>
        <Grid
          w="100%"
          templateAreas={`"completion note"`}
          gridTemplateColumns="auto auto"
        >
          {completionLabel && (
            <Text gridArea="completion" fontSize="sm" color="gray.600" mr={8}>
              {completionLabel}
            </Text>
          )}
          <Text
            noOfLines={1}
            gridArea="note"
            justifySelf="end"
            fontSize="sm"
            color="gray.600"
          >
            {item.completionForCurrentPeriod?.note}
          </Text>
        </Grid>
      </Flex>
    </ListItem>
  );
}
