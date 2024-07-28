import {
  Input,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import useTasks from "./useTasks";
import useTaskStore from "../../../hooks/useTaskStore";
import { useRef, useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  taskTitleInput: HTMLInputElement;
}
interface CreateTaskFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function CreateTask() {
  const { addTask } = useTasks();
  const { frequency } = useTaskStore();
  const [inputText, setInputText] = useState("");

  const initialFocusRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent<CreateTaskFormElement>) => {
    const title = inputText.trim();
    if (!title) {
      return;
    }
    e.preventDefault();
    await addTask(title);
    setInputText("");
  };
  return (
    <Popover initialFocusRef={initialFocusRef}>
      <PopoverTrigger>
        <IconButton
          position="fixed"
          bottom={8}
          right={8}
          aria-label="Add a new task"
        >
          <AddIcon />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{`Add new ${frequency} task`}</PopoverHeader>
        <PopoverBody>
          <form onSubmit={handleSubmit}>
            <Flex>
              <Input
                ref={initialFocusRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                name="title"
                id="taskTitleInput"
                placeholder={`New ${frequency} task title`}
              />
              <IconButton type="submit" ml={4} aria-label="Submit new task">
                <CheckIcon />
              </IconButton>
            </Flex>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
