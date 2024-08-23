import TaskList from "./components/TaskList";
import AddDrawer from "./components/AddDrawer";
import { useSubscribeToTaskEvents } from "./useTaskStore";

export default function Tasks() {
  useSubscribeToTaskEvents();

  return (
    <>
      <TaskList />
      <AddDrawer />
    </>
  );
}
