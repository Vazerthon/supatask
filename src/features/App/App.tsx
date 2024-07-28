import { Box, Flex, Text } from "@chakra-ui/react";
import Login from "./components/Login";
import useSessionStore from "../tasks/components/useSessionStore";
import Logout from "./components/Logout";
import Tasks from "../tasks/Tasks";

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
