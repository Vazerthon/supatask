import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  IconButton,
  Flex,
  Box,
  Icon,
} from "@chakra-ui/react";
import { useRef } from "react";
import Logout from "./Logout";
import LabelList from "../../labels/LabelList";
import CreateLabel from "../../labels/CreateLabel";
import icons from "../../../icons";
import FilterCompletedTasksToggle from "../../tasks/FilterCompletedTasksToggle";

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
        <Icon as={icons.Menu} />
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
          <DrawerBody>
            <Flex flexDirection="column">
              <LabelList />
              <Box as="hr" m={4} />
              <CreateLabel />
              <Box as="hr" m={4} />
              <FilterCompletedTasksToggle />
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Logout />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
