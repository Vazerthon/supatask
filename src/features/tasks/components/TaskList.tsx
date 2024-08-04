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
  const { frequencies, setFrequency, frequencyLabel } = useTaskStore();
  const { filteredTasks } = useSharedState();

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
                <Text as="h1" fontSize="large">
                  {frequencyLabel[frequency]}
                </Text>
                <UnorderedList>
                  <CheckboxGroup>
                    {filteredTasks.map((task) => (
                      <TaskListItem item={task} key={task.id} />
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
