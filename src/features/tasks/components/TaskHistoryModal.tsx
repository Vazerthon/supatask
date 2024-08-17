import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
  ListItem,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { Task } from "../../../types/types";
import { formatShortDate } from "../../../date-helpers";

interface TaskHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function TaskHistoryModal({
  isOpen,
  onClose,
  task,
}: TaskHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text noOfLines={1}>History for {task.title}</Text>
        </ModalHeader>
        <ModalCloseButton mt={2} mr={1} />
        <ModalBody>
          <UnorderedList>
            {task.completion.length === 0 && (
              <ListItem listStyleType="none">
                This task has never been completed 😥
              </ListItem>
            )}
            {task.completion.map(({ complete, completed_at, id, note }, i) => (
              <ListItem
                key={id}
                listStyleType="none"
                backgroundColor={i % 2 === 0 ? "gray.50" : "white"}
              >
                <Checkbox isChecked={complete} isDisabled>
                  {completed_at && formatShortDate(completed_at)}
                  {note && completed_at ? ` - ${note}` : note}
                </Checkbox>
              </ListItem>
            ))}
          </UnorderedList>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
