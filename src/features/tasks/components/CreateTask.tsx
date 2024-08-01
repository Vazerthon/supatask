import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  Input,
  Flex,
  IconButton,
  DrawerHeader,
} from "@chakra-ui/react";

import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import useTasks from "./useTasks";
import useTaskStore from "../useTaskStore";
import { useRef, useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  taskTitleInput: HTMLInputElement;
}
interface CreateTaskFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function CreateTask() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

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
    <>
      <IconButton
        position="fixed"
        bottom={8}
        right={8}
        aria-label="Add a new task"
        ref={btnRef}
        onClick={onOpen}
      >
        <AddIcon />
      </IconButton>

      <Drawer
        isOpen={isOpen}
        placement="right"
        isFullHeight
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Create a new {frequency} task</DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Flex>
                <Input
                  ref={initialFocusRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  name="title"
                  id="taskTitleInput"
                  placeholder={`New ${frequency} task title`}
                />
              </Flex>
            </DrawerBody>

            <DrawerFooter>
              <IconButton type="submit" ml={4} aria-label="Submit new task">
                <CheckIcon />
              </IconButton>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
