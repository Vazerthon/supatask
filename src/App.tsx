import Login from "./Login";
import useSessionStore from "./state/useSessionStore";
import TaskList from "./TaskList";

function App() {
  const { session } = useSessionStore();

  return (
    <>
      <Login />
      {!!session && <TaskList />}
    </>
  );
}

export default App;
