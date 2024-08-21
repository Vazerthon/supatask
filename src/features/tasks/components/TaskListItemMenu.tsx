import {
  Box,
  BoxProps,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import icons from "../../../icons";
import { Task, Completion } from "../../../types/types";
import AddNoteModal from "./AddNoteModal";
import TaskHistoryModal from "./TaskHistoryModal";
import { useTasksApi } from "../useTaskStore";

interface TaskListItemMenuProps extends BoxProps {
  task: Task;
  completionForCurrentPeriod?: Completion;
}

export default function TaskListItemMenu({
  task,
  completionForCurrentPeriod,
  ...boxProps
}: TaskListItemMenuProps) {
  const { deleteTask } = useTasksApi();

  const {
    isOpen: isNoteModalOpen,
    onOpen: onNoteModalOpen,
    onClose: onNoteModalClose,
  } = useDisclosure();

  const {
    isOpen: isHistoryModalOpen,
    onOpen: onHistoryModalOpen,
    onClose: onHistoryModalClose,
  } = useDisclosure();

  const handleDeleteClick = () => {
    deleteTask(task.id);
  };

  return (
    <Box {...boxProps}>
      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={onNoteModalClose}
        task={task}
        completionForCurrentPeriod={completionForCurrentPeriod}
      />
      <TaskHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={onHistoryModalClose}
        task={task}
      />
      <Menu>
        <MenuButton as={IconButton} variant="transparent">
          <Icon as={icons.More} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
          <MenuItem onClick={onNoteModalOpen}>Add note</MenuItem>
          <MenuItem onClick={onHistoryModalOpen}>History</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
