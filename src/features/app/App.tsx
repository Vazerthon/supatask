import { Box } from "@chakra-ui/react";
import Login from "./components/Login";
import useSessionStore from "../../state/useSessionStore";
import Tasks from "../tasks/Tasks";
import Menu from "./components/Menu";
import Labels from "../labels/Labels";

function App() {
  const { session } = useSessionStore();

  return (
    <>
      <Box m={4}>
        {!!session && (
          <>
            <Tasks />
            <Labels />
            <Menu />
          </>
        )}
        <Login />
      </Box>
    </>
  );
}

export default App;
