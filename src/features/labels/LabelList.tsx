import {
  Badge,
  Checkbox,
  CheckboxGroup,
  Grid,
  List,
  ListItem,
  Text,
  Flex,
} from "@chakra-ui/react";
import useLabelStore from "./useLabelStore";

export default function LabelList() {
  const { labels, enableLabel, disableLabel, enableAll, disableAll } =
    useLabelStore();

  const allEnabled = labels.every((label) => label.enabled);

  const handleCheckboxChange = (labelId: string, enabled: boolean) => {
    if (enabled) {
      enableLabel(labelId);
    } else {
      disableLabel(labelId);
    }
  };

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
            <ListItem key={label.id}>
              <Checkbox
                isChecked={label.enabled}
                onChange={() => handleCheckboxChange(label.id, !label.enabled)}
              >
                <Grid templateColumns="auto 1fr" gap={2}>
                  <Text noOfLines={1}>{label.text}</Text>

                  <Badge
                    w={4}
                    h={4}
                    borderRadius="50%"
                    backgroundColor={label.color_hex}
                    alignSelf="center"
                  />
                </Grid>
              </Checkbox>
            </ListItem>
          ))}
        </CheckboxGroup>
      </List>
    </>
  );
}
