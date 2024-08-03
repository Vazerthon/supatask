import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  IconButton,
  Flex,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import CreateTask from "../CreateTask";

export default function AddDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <>
      <IconButton
        position="fixed"
        bottom={8}
        right={8}
        aria-label="Add new items"
        ref={btnRef}
        onClick={onOpen}
      >
        <AddIcon />
      </IconButton>

      <Drawer
        isOpen={isOpen}
        placement="right"
        isFullHeight
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Flex flexDirection="column">
              <CreateTask />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
