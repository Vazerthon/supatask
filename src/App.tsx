import { Box } from "@chakra-ui/react";
import Login from "./Login";
import useSessionStore from "./hooks/useSessionStore";
import TaskList from "./TaskList";

function App() {
  const { session } = useSessionStore();

  return (
    <Box m={4} p={4}>
      <Login />
      {!!session && <TaskList />}
    </Box>
  );
}

export default App;
