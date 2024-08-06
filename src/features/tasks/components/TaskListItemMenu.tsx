import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

export default function TaskListItemMenu() {
  return (
    <Menu>
      <MenuButton as={IconButton} variant="transparent">
        <HamburgerIcon />
      </MenuButton>
      <MenuList>
        <MenuItem>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
}
