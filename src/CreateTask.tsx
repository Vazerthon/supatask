import { Input, Button, Flex } from "@chakra-ui/react";
import { supabase } from "./supabaseClient";
import constants from "./constants";
import useTasks from "./hooks/useTasks";

interface FormElements extends HTMLFormControlsCollection {
  taskTitleInput: HTMLInputElement;
}
interface CreateTaskFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function CreateTask() {
  const { addTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent<CreateTaskFormElement>) => {
    e.preventDefault();
    const title = e.currentTarget.elements.taskTitleInput.value;
    await addTask(title);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex>
          <Input name="title" id="taskTitleInput" placeholder="Task title" />
          <Button type="submit" ml={4}>
            Create Task
          </Button>
        </Flex>
      </form>
    </>
  );
}
