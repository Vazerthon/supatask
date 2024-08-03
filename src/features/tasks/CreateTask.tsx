import { Input, Flex, IconButton, Text } from "@chakra-ui/react";

import { CheckIcon } from "@chakra-ui/icons";
import useTasks from "./components/useTasks";
import useTaskStore from "./useTaskStore";
import { useRef, useState } from "react";

export default function CreateTask() {
  const { addTask } = useTasks();
  const { frequency } = useTaskStore();
  const [inputText, setInputText] = useState("");

  const initialFocusRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    const title = inputText.trim();
    if (!title) {
      return;
    }
    e.preventDefault();
    await addTask(title);
    setInputText("");
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
        </Flex>

        <Flex flexDirection="row" justifyContent="flex-end">
          <IconButton type="submit" mt={2} aria-label="Submit new task">
            <CheckIcon />
          </IconButton>
        </Flex>
      </form>
    </>
  );
}
