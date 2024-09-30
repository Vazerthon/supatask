import { Input, Flex, IconButton, Icon } from "@chakra-ui/react";
import { useState } from "react";
import icons from "../../icons";
import { useLabelsApi } from "./useLabelStore";
import { Label } from "../../types/types";

interface LabelEditorProps {
  label?: Label;
  initialFocusRef: React.RefObject<HTMLInputElement>;
}

export default function LabelEditor({
  label,
  initialFocusRef,
}: LabelEditorProps) {
  const { upsertLabel } = useLabelsApi();
  const [inputText, setInputText] = useState(label?.text || "");
  const [inputColor, setInputColor] = useState(label?.color_hex || "#000000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) {
      return;
    }
    await upsertLabel(text, inputColor, label?.id);
    setInputText("");
    setInputColor("#000000");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column">
          <Input
            ref={initialFocusRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            name="title"
            id="labelTitleInput"
            placeholder="Label title"
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
            aria-label="Submit label"
            isDisabled={!inputText.trim()}
          >
            <Icon as={icons.Check} />
          </IconButton>
        </Flex>
      </form>
    </>
  );
}
