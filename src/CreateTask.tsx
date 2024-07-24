import { Input, Button, Flex } from "@chakra-ui/react";
import { supabase } from "./supabaseClient";

interface FormElements extends HTMLFormControlsCollection {
  taskTitleInput: HTMLInputElement;
}
interface CreateTaskFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function CreateTask() {
  const handleSubmit = async (e: React.FormEvent<CreateTaskFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.elements);
    const title = e.currentTarget.elements.taskTitleInput.value;
    await supabase.from("task").insert([{ title }]);
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
