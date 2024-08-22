import { Checkbox } from "@chakra-ui/react";
import { useHideCompleted, useSetHideCompleted } from "./useTaskStore";
export default function FilterCompletedTasksToggle() {
  const hideCompleted = useHideCompleted();
  const setHideCompleted = useSetHideCompleted();
  return (
    <Checkbox
      isChecked={hideCompleted}
      onChange={() => setHideCompleted(!hideCompleted)}
    >
      Hide completed tasks
    </Checkbox>
  );
}
