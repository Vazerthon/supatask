import { Badge, Checkbox, Grid, ListItem, Text } from "@chakra-ui/react";
import useLabelStore from "./useLabelStore";
import { Label } from "../../types/types";

export default function LabelListItem({ label }: { label: Label }) {
  const { enableLabel, disableLabel } = useLabelStore();

  const handleCheckboxChange = (labelId: string, enabled: boolean) => {
    if (enabled) {
      enableLabel(labelId);
    } else {
      disableLabel(labelId);
    }
  };

  return (
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
  );
}
