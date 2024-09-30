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
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";
import Logout from "./Logout";
import LabelList from "../../labels/LabelList";
import LabelEditor from "../../labels/LabelEditor";
import icons from "../../../icons";
import FilterCompletedTasksToggle from "../../tasks/FilterCompletedTasksToggle";

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const labelEditorRef = useRef<HTMLInputElement>(null);

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
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Create a new label
              </Text>
              <LabelEditor initialFocusRef={labelEditorRef} />
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
