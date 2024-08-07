import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import icons from "../../../icons";
import { Task } from "../../../types/types";
import useTasks from "./useTasks";

interface TaskListItemMenuProps {
  task: Task;
}

export default function TaskListItemMenu({ task }: TaskListItemMenuProps) {
  const { deleteTask } = useTasks();

  const handleDeleteClick = () => {
    deleteTask(task.id);
  };

  return (
    <Menu>
      <MenuButton as={IconButton} variant="transparent">
        <Icon as={icons.More} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
}
