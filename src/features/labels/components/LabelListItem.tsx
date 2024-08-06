import { Checkbox, Grid, ListItem, Text } from "@chakra-ui/react";
import useLabelStore from "../useLabelStore";
import { Label } from "../../../types/types";
import LabelBadge from "./LabelBadge";

interface LabelListItemProps {
  label: Label;
  hideBadge?: boolean;
}

export default function LabelListItem({
  label,
  hideBadge,
}: LabelListItemProps) {
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

          {!hideBadge && <LabelBadge label={label} />}
        </Grid>
      </Checkbox>
    </ListItem>
  );
}
