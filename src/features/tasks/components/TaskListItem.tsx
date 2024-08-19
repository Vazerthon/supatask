import {
  Checkbox,
  Grid,
  ListItem,
  ListItemProps,
  Text,
} from "@chakra-ui/react";
import { Task, Completion } from "../../../types/types";
import useTaskStore from "../useTaskStore";
import useTasks from "./useTasks";
import TaskLabelList from "../../labels/TaskLabelList";
import TaskListItemMenu from "./TaskListItemMenu";
import {
  countDaysToNow,
  formatShortDate,
  maxDate,
} from "../../../date-helpers";

interface TaskListItemProps extends ListItemProps {
  item: Task;
}

export default function TaskListItem({
  item,
  ...listItemProps
}: TaskListItemProps) {
  const { frequencyPeriod } = useTaskStore();
  const { toggleTaskCompletion } = useTasks();

  const completionForCurrentPeriod: Completion | undefined =
    item.completion.find((c) => c.period === frequencyPeriod[item.frequency]);

  const isChecked = completionForCurrentPeriod?.complete || false;
  const completedAtDateString = completionForCurrentPeriod?.completed_at;
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
        <Grid
          templateAreas={`
          "task label menu"
          "completion  note note"
          `}
          gridTemplateColumns="1fr auto auto"
          gap={2}
        >
          <Text gridArea="task" alignContent="center">
            {item.title}
          </Text>
          {completionLabel && (
            <Text gridArea="completion" fontSize="sm" color="gray.600">
              {completionLabel}
            </Text>
          )}
          <Text gridArea="note" fontSize="sm" color="gray.600">
            {completionForCurrentPeriod?.note}
          </Text>

          <TaskLabelList gridArea="label" task={item} />
          <TaskListItemMenu
            gridArea="menu"
            task={item}
            completionForCurrentPeriod={completionForCurrentPeriod}
          />
        </Grid>
      </Checkbox>
    </ListItem>
  );
}
