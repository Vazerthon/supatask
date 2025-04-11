import {
  Checkbox,
  Flex,
  Grid,
  Icon,
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
import { useTasksApi, type Frequency } from "../useTaskStore";
import { useMemo } from "react";
import icons from "../../../icons";

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

  const itemIsCompleteThisPeriod =
    !!item.completionForCurrentPeriod?.completed_at;

  const completionString =
    completedAtDateString &&
    `completed: ${formatShortDate(completedAtDateString)}`;

  const distanceFromLastCompletion = useMemo(() => {
    const completionDates = item.completion
      .map((c) => (c.complete ? c.completed_at : null))
      .filter((d) => d !== null);
    const lastCompletionDate = maxDate(completionDates);
    return lastCompletionDate ? countDaysToNow(lastCompletionDate) : null;
  }, [item.completion]);

  const distanceFromLastCompletionLabel = useMemo(() => {
    return distanceFromLastCompletion && distanceFromLastCompletion > 0
      ? `last completed ${distanceFromLastCompletion} day${
          distanceFromLastCompletion === 1 ? "" : "s"
        } ago`
      : null;
  }, [distanceFromLastCompletion]);

  const completionLabel = completionString || distanceFromLastCompletionLabel;

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await toggleTaskCompletion(
      item,
      event.target.checked,
      item.completionForCurrentPeriod
    );
  };

  const completionLabelColor = useMemo(() => {
    if (itemIsCompleteThisPeriod || !distanceFromLastCompletion) {
      return {
        color: "gray.600",
        showIcon: false,
      };
    }

    const thresholds: Record<Frequency, number> = {
      "one off": 0,
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const warningThresholds: Record<Frequency, number> = {
      "one off": 0,
      daily: 1,
      weekly: 5,
      monthly: 25,
      yearly: 300,
    };

    const frequency = item.frequency;
    const distance = distanceFromLastCompletion;

    if (distance < warningThresholds[frequency]) {
      return {
        color: "gray.600",
        showIcon: false,
      };
    }

    if (
      distance > warningThresholds[frequency] &&
      distance < thresholds[frequency]
    ) {
      return {
        color: "orange.700",
        showIcon: false,
      };
    }

    if (distance > thresholds[frequency]) {
      return {
        color: "red.700",
        showIcon: true,
      };
    }

    return {
      color: "gray.600",
      showIcon: false,
    };
  }, [itemIsCompleteThisPeriod, distanceFromLastCompletion, item.frequency]);

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
            <Text
              gridArea="completion"
              fontSize="sm"
              color={completionLabelColor.color}
              mr={8}
              display="flex"
              alignItems="center"
            >
              {completionLabel}
              {completionLabelColor.showIcon && (
                <Icon as={icons.Warning} ml={1} />
              )}
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
