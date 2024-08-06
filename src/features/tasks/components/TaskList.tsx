import {
  Stack,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
  Text,
  CheckboxGroup,
} from "@chakra-ui/react";
import useTaskStore from "../useTaskStore";
import TaskListItem from "./TaskListItem";
import useSharedState from "../../useSharedState";

function TaskList() {
  const { tasks, frequencies, setFrequency, frequencyLabel } = useTaskStore();
  const { filteredTasks } = useSharedState();

  const handleTabChange = (index: number) => {
    setFrequency(frequencies[index]);
  };

  const totalTasksCount = tasks.length;
  const hiddenByFiltersCount = totalTasksCount - filteredTasks.length;

  return (
    <Tabs onChange={handleTabChange}>
      <TabList mb={2} border="none">
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
                <Text as="h1" fontSize="large">
                  {frequencyLabel[frequency]}
                  {hiddenByFiltersCount > 0 && (
                    <Text as="span" fontSize="small" ml={2}>
                      ({hiddenByFiltersCount} task
                      {hiddenByFiltersCount === 1 ? "" : "s"} hidden)
                    </Text>
                  )}
                </Text>
                <UnorderedList>
                  <CheckboxGroup>
                    {filteredTasks.map((task, i) => (
                      <TaskListItem
                        item={task}
                        key={task.id}
                        backgroundColor={i % 2 === 0 ? "gray.50" : "white"}
                      />
                    ))}
                  </CheckboxGroup>
                  {filteredTasks.length === 0 && (
                    <Flex
                      width="100%"
                      minHeight="70vh"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="xl">Nothing to do 🎉</Text>
                    </Flex>
                  )}
                </UnorderedList>
              </TabPanel>
            ))}
          </TabPanels>
        </Stack>
      </TabList>
    </Tabs>
  );
}

export default TaskList;
