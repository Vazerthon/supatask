import { ListItem, UnorderedList } from "@chakra-ui/react";
import CreateTask from "./CreateTask";
import useTaskStore from "./hooks/useTaskStore";

function TaskList() {
  const { tasks } = useTaskStore();

  return (
    <>
      <UnorderedList>
        {tasks.map((task) => (
          <ListItem key={task.id}>{task.title}</ListItem>
        ))}
      </UnorderedList>
      <CreateTask />
    </>
  );
}

export default TaskList;
