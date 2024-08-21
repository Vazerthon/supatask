import { Checkbox, CheckboxGroup, List, Text, Flex } from "@chakra-ui/react";
import {
  useLabelList,
  useEnableAllLabels,
  useDisableAllLabels,
} from "./useLabelStore";
import LabelListItem from "./components/LabelListItem";
import constants from "../../constants";

export default function LabelList() {
  const labels = useLabelList();
  const enableAll = useEnableAllLabels();
  const disableAll = useDisableAllLabels();

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
          {labels.map((label, i) => (
            <LabelListItem
              key={label.id}
              label={label}
              hideBadge={label.id === constants.UNLABELLED_ITEM_ID}
              backgroundColor={i % 2 === 0 ? "gray.50" : "white"}
            />
          ))}
        </CheckboxGroup>
      </List>
    </>
  );
}
