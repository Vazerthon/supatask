import { Box } from "@chakra-ui/react";
import Login from "./components/Login";
import useSessionStore from "../tasks/components/useSessionStore";
import Tasks from "../tasks/Tasks";
import Menu from "./components/Menu";

function App() {
  const { session } = useSessionStore();

  return (
    <>
      <Box m={4} p={4}>
        {!!session && <Tasks />}
        <Login />
        <Menu />
      </Box>
    </>
  );
}

export default App;
