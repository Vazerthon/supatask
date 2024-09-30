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
import { Label } from "../../../types/types";
import EditLabelModal from "./EditLabelModal";

interface LabelMenuProps extends BoxProps {
  label: Label;
}

export default function LabelMenu({ label, ...boxProps }: LabelMenuProps) {
  const {
    isOpen: isEditLabelOpen,
    onOpen: onEditLabelOpen,
    onClose: onEditLabelClose,
  } = useDisclosure();

  return (
    <Box {...boxProps}>
      <EditLabelModal
        isOpen={isEditLabelOpen}
        onClose={onEditLabelClose}
        label={label}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          variant="transparent"
          aria-label={`label menu for ${label.text}`}
        >
          <Icon as={icons.More} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onEditLabelOpen}>Edit</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
