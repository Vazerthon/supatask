import { Checkbox, ListItem, Text } from "@chakra-ui/react";
import { Task } from "./types/types";
import useTaskStore from "./hooks/useTaskStore";
import { useCallback } from "react";
import { supabase } from "./supabaseClient";
import constants from "./constants";

type TaskListItemProps = {
  item: Task;
};

export default function TaskListItem({ item }: TaskListItemProps) {
  const { frequencyPeriod, frequency } = useTaskStore();

  const completionForCurrentPeriod = item.completion.find(
    (c) => c.period === frequencyPeriod[item.frequency]
  );

  const isChecked = completionForCurrentPeriod?.complete || false;

  // TODO move this to useTask but beware the number of re-renders
  const toggleTaskCompletion = useCallback(
    async (task: Task, complete: boolean) => {
      await supabase.from(constants.COMPLETION_TABLE).upsert({
        id: completionForCurrentPeriod?.id,
        task_id: task.id,
        period: frequencyPeriod[frequency],
        complete,
      });
    },
    [completionForCurrentPeriod, frequency, frequencyPeriod]
  );

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await toggleTaskCompletion(item, event.target.checked);
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
