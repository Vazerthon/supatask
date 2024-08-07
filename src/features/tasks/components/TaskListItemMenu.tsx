import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import icons from "../../../icons";

export default function TaskListItemMenu() {
  return (
    <Menu>
      <MenuButton as={IconButton} variant="transparent">
        <Icon as={icons.More} />
      </MenuButton>
      <MenuList>
        <MenuItem>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
}
