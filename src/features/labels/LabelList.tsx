import { Checkbox, CheckboxGroup, List, Text, Flex } from "@chakra-ui/react";
import useLabelStore from "./useLabelStore";
import LabelListItem from "./LabelListItem";

export default function LabelList() {
  const { labels, enableAll, disableAll } = useLabelStore();

  const allEnabled = labels.every((label) => label.enabled);

  return (
    <>
      <Flex>
        <Checkbox
          isChecked={allEnabled}
          onChange={allEnabled ? disableAll : enableAll}
          mr={2}
        />
        <Text fontSize="lg" fontWeight="bold">
          Filter by labels
        </Text>
      </Flex>
      <List>
        <CheckboxGroup>
          {labels.map((label) => (
            <LabelListItem key={label.id} label={label} />
          ))}
        </CheckboxGroup>
      </List>
    </>
  );
}
