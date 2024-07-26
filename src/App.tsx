import { Box, Flex, Text } from "@chakra-ui/react";
import Login from "./Login";
import useSessionStore from "./hooks/useSessionStore";
import TaskList from "./TaskList";
import CreateTask from "./CreateTask";
import Logout from "./Logout";

function App() {
  const { session } = useSessionStore();

  return (
    <Box m={4} p={4}>
      {!!session && (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text>Get stuff done!</Text>
            <Logout />
          </Flex>
          <TaskList />
          <CreateTask />
        </>
      )}
      <Login />
    </Box>
  );
}

export default App;
