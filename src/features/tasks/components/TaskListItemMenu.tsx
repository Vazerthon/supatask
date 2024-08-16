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
import useTasks from "./useTasks";
import AddNoteModal from "./AddNoteModal";

interface TaskListItemMenuProps extends BoxProps {
  task: Task;
  completionForCurrentPeriod?: Completion;
}

export default function TaskListItemMenu({
  task,
  completionForCurrentPeriod,
  ...boxProps
}: TaskListItemMenuProps) {
  const { deleteTask } = useTasks();

  const {
    isOpen: isNoteModalOpen,
    onOpen: onNoteModalOpen,
    onClose: onNoteModalClose,
  } = useDisclosure();

  const handleDeleteClick = () => {
    deleteTask(task.id);
  };

  const handleAddNoteClick = () => {
    onNoteModalOpen();
  };

  return (
    <Box {...boxProps}>
      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={onNoteModalClose}
        task={task}
        completionForCurrentPeriod={completionForCurrentPeriod}
      />
      <Menu>
        <MenuButton as={IconButton} variant="transparent">
          <Icon as={icons.More} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
          <MenuItem onClick={handleAddNoteClick}>Add note</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
