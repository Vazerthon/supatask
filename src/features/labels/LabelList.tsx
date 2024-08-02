import {
  Badge,
  Checkbox,
  CheckboxGroup,
  Flex,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import useLabelStore from "./useLabelStore";

export default function LabelList() {
  const { labels, enableLabel, disableLabel } = useLabelStore();

  const handleCheckboxChange = (labelId: string, enabled: boolean) => {
    if (enabled) {
      enableLabel(labelId);
    } else {
      disableLabel(labelId);
    }
  };

  return (
    <>
      <Text fontSize="lg" fontWeight="bold">
        Labels
      </Text>
      <List>
        <CheckboxGroup>
          {labels.map((label) => (
            <ListItem key={label.id}>
              <Flex alignItems="center">
                <Checkbox
                  isChecked={label.enabled}
                  onChange={() =>
                    handleCheckboxChange(label.id, !label.enabled)
                  }
                  flexGrow={1}
                >
                  <Text noOfLines={1}>{label.text}</Text>
                </Checkbox>
                <Badge
                  w={4}
                  h={4}
                  minW={4}
                  borderRadius="50%"
                  backgroundColor={label.color_hex}
                />
              </Flex>
            </ListItem>
          ))}
        </CheckboxGroup>
      </List>
    </>
  );
}
