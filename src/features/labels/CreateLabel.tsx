import { Input, Flex, IconButton, Text, Icon } from "@chakra-ui/react";
import { useRef, useState } from "react";
import useLabels from "./useLabels";
import icons from "../../icons";

export default function CreateLabel() {
  const { addLabel } = useLabels();
  const [inputText, setInputText] = useState("");
  const [inputColor, setInputColor] = useState("#000000");

  const initialFocusRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) {
      return;
    }
    await addLabel(text, inputColor);
    setInputText("");
    setInputColor("#000000");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column">
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Create a new label
          </Text>
          <Input
            ref={initialFocusRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            name="title"
            id="labelTitleInput"
            placeholder="New label title"
            mb={2}
          />
          <Input
            type="color"
            name="color"
            id="labelColorInput"
            value={inputColor}
            onChange={(e) => setInputColor(e.target.value)}
          />
        </Flex>

        <Flex flexDirection="row" justifyContent="flex-end">
          <IconButton
            type="submit"
            mt={2}
            aria-label="Submit new label"
            isDisabled={!inputText.trim()}
          >
            <Icon as={icons.Check} />
          </IconButton>
        </Flex>
      </form>
    </>
  );
}
