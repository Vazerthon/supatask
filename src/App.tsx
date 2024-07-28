import { Box, Flex, Text } from "@chakra-ui/react";
import Login from "./Login";
import useSessionStore from "./features/tasks/components/useSessionStore";
import Logout from "./Logout";
import Tasks from "./features/tasks/Tasks";

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
          <Tasks />
        </>
      )}
      <Login />
    </Box>
  );
}

export default App;
