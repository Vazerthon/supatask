import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Label } from "../../../types/types";
import LabelEditor from "../LabelEditor";
import { useRef } from "react";

interface EditLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: Label;
}

export default function EditLabelModal({
  isOpen,
  onClose,
  label,
}: EditLabelModalProps) {
  const initialFocusRef = useRef<HTMLInputElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialFocusRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit label</ModalHeader>
        <ModalCloseButton mt={2} mr={1} />
        <ModalBody>
          <LabelEditor label={label} initialFocusRef={initialFocusRef} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
