import { Box } from "@chakra-ui/react";
import Login from "./components/Login";
import useSessionStore from "../../hooks/useSessionStore";
import Tasks from "../tasks/Tasks";
import Menu from "./components/Menu";
import Labels from "../labels/Labels";

function App() {
  const { session } = useSessionStore();

  return (
    <>
      <Box m={4} p={4}>
        {!!session && (
          <>
            <Tasks />
            <Labels />
          </>
        )}
        <Login />
        <Menu />
      </Box>
    </>
  );
}

export default App;
