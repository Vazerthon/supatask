import { Input, Button, Flex } from "@chakra-ui/react";
import useTasks from "./hooks/useTasks";
import useTaskStore from "./hooks/useTaskStore";

interface FormElements extends HTMLFormControlsCollection {
  taskTitleInput: HTMLInputElement;
}
interface CreateTaskFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function CreateTask() {
  const { addTask } = useTasks();
  const { frequency } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent<CreateTaskFormElement>) => {
    e.preventDefault();
    const title = e.currentTarget.elements.taskTitleInput.value;
    await addTask(title);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex>
          <Input
            name="title"
            id="taskTitleInput"
            placeholder={`New ${frequency} task title`}
          />
          <Button type="submit" ml={4}>
            New {frequency} task
          </Button>
        </Flex>
      </form>
    </>
  );
}
