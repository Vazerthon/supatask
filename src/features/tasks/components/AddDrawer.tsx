import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  IconButton,
  Flex,
  Icon,
} from "@chakra-ui/react";

import { useRef } from "react";
import CreateTask from "./CreateTask";
import icons from "../../../icons";

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
        <Icon as={icons.Plus} />
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
