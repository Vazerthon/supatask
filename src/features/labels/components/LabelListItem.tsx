import { Checkbox, Flex, Grid, ListItem, Text } from "@chakra-ui/react";
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
        w="100%"
        sx={{
          // is there a good way to do this? I dunno
          ".chakra-checkbox__label": {
            width: "100%",
          },
        }}
      >
        <Grid templateColumns="auto 1fr" gap={2}>
          <Text noOfLines={1}>{label.text}</Text>

          {!hideBadge && (
            <Flex flexDirection="row-reverse">
              <LabelBadge label={label} />
            </Flex>
          )}
        </Grid>
      </Checkbox>
    </ListItem>
  );
}
