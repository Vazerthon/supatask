import {
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Completion, Task } from "../../../types/types";
import icons from "../../../icons";
import { useRef, useState } from "react";
import useTasks from "./useTasks";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  completionForCurrentPeriod?: Completion;
}

export default function AddNoteModal({
  isOpen,
  onClose,
  task,
  completionForCurrentPeriod,
}: AddNoteModalProps) {
  const { addTaskNote } = useTasks();

  const [inputText, setInputText] = useState(
    completionForCurrentPeriod?.note || ""
  );
  const initialFocusRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    const note = inputText.trim();
    e.preventDefault();

    await addTaskNote(task, note, completionForCurrentPeriod);

    setInputText("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Task note</ModalHeader>
          <ModalCloseButton mt={2} mr={1} />
          <ModalBody>
            <Input
              ref={initialFocusRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              name="note"
              id="noteInput"
              placeholder="Note"
            />
          </ModalBody>

          <ModalFooter>
            <IconButton type="submit" aria-label="Save task note">
              <Icon as={icons.Check} />
            </IconButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
