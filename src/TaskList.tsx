import {
  ListItem,
  Stack,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
} from "@chakra-ui/react";
import CreateTask from "./CreateTask";
import useTaskStore from "./hooks/useTaskStore";
import TaskListItem from "./TaskListItem";

function TaskList() {
  const { tasks, frequencies, setFrequency } = useTaskStore();

  const handleTabChange = (index: number) => {
    setFrequency(frequencies[index]);
  };

  return (
    <Tabs onChange={handleTabChange}>
      <TabList mb={2}>
        <Stack width="100%">
          <Flex>
            {frequencies.map((frequency) => (
              <Tab textTransform="capitalize" key={frequency}>
                {frequency}
              </Tab>
            ))}
          </Flex>
          <TabPanels>
            {frequencies.map((frequency) => (
              <TabPanel key={frequency}>
                <UnorderedList>
                  {tasks.map((task) => (
                    <TaskListItem item={task} key={task.id} />
                  ))}
                </UnorderedList>
              </TabPanel>
            ))}
          </TabPanels>
        </Stack>
      </TabList>
      <CreateTask />
    </Tabs>
  );
}

export default TaskList;
