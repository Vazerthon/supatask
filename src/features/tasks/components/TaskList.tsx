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
import {
  useTasksList,
  useFrequencies,
  useFrequencyLabel,
  useSetFrequency,
} from "../useTaskStore";
import TaskListItem from "./TaskListItem";

import { useLabelsAsDict } from "../../labels/useLabelStore";

function TaskList() {
  const frequencies = useFrequencies();
  const frequencyLabel = useFrequencyLabel();
  const setFrequency = useSetFrequency();
  const labelsDictionary = useLabelsAsDict();
  const { tasks, hiddenCount } = useTasksList(labelsDictionary);

  const handleTabChange = (index: number) => {
    setFrequency(frequencies[index]);
  };

  return (
    <Tabs onChange={handleTabChange}>
      <TabList mb={2} border="none">
        <Stack width="100%">
          <Flex>
            {frequencies.map((frequency) => (
              <Tab
                textTransform="capitalize"
                key={frequency}
                _first={{ pl: 0 }}
              >
                {frequency}
              </Tab>
            ))}
          </Flex>
          <TabPanels>
            {frequencies.map((frequency) => (
              <TabPanel key={frequency} p={0}>
                <Text as="h1" fontSize="large" mb={4} mt={2}>
                  {frequencyLabel[frequency]}
                  {hiddenCount > 0 && (
                    <Text as="span" fontSize="small" ml={2}>
                      ({hiddenCount} task
                      {hiddenCount === 1 ? "" : "s"} hidden)
                    </Text>
                  )}
                </Text>
                <UnorderedList marginInlineStart={0}>
                  <CheckboxGroup>
                    {tasks.map((task, i) => (
                      <TaskListItem
                        item={task}
                        key={task.id}
                        backgroundColor={i % 2 === 0 ? "gray.50" : "white"}
                        py={2}
                        px={1}
                        borderRadius="xs"
                      />
                    ))}
                  </CheckboxGroup>
                  {tasks.length === 0 && (
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
