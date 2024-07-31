import { HamburgerIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  IconButton,
} from "@chakra-ui/react";
import { useRef } from "react";
import Logout from "./Logout";

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  return (
    <>
      <IconButton
        ref={btnRef}
        onClick={onOpen}
        aria-label="open main menu"
        position="fixed"
        bottom={8}
        left={8}
      >
        <HamburgerIcon />
      </IconButton>
      <Drawer
        isOpen={isOpen}
        placement="left"
        isFullHeight
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody></DrawerBody>

          <DrawerFooter>
            <Logout />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
