import { Input, Flex, IconButton, Text, Icon } from "@chakra-ui/react";

import { useTasksApi, useFrequency } from "../useTaskStore";
import { useRef, useState } from "react";
import { Label } from "../../../types/types";
import SelectLabels from "../../labels/SelectLabels";
import icons from "../../../icons";

export default function CreateTask() {
  const { addTask } = useTasksApi();
  const frequency = useFrequency();
  const [inputText, setInputText] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(
    new Array<Label>()
  );

  const initialFocusRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    const title = inputText.trim();
    if (!title) {
      return;
    }
    e.preventDefault();
    await addTask(title, selectedLabels);

    setInputText("");
    setSelectedLabels(new Array<Label>());
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column">
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Create a new {frequency} task
          </Text>
          <Input
            ref={initialFocusRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            name="title"
            id="taskTitleInput"
            placeholder={`New ${frequency} task title`}
          />
          <SelectLabels
            selectedLabels={selectedLabels}
            onSelectionChange={setSelectedLabels}
            mt={2}
          />
        </Flex>

        <Flex flexDirection="row" justifyContent="flex-end">
          <IconButton
            type="submit"
            mt={2}
            aria-label="Submit new task"
            isDisabled={!inputText.trim()}
          >
            <Icon as={icons.Check} />
          </IconButton>
        </Flex>
      </form>
    </>
  );
}
