import {
  Checkbox,
  Flex,
  Grid,
  ListItem,
  ListItemProps,
  Text,
} from "@chakra-ui/react";
import { useEnableLabel, useDisableLabel } from "../useLabelStore";
import { Label } from "../../../types/types";
import LabelBadge from "./LabelBadge";
import LabelMenu from "./LabelMenu";

interface LabelListItemProps extends ListItemProps {
  label: Label;
  hideBadge?: boolean;
}

export default function LabelListItem({
  label,
  hideBadge,
  ...listItemProps
}: LabelListItemProps) {
  const enableLabel = useEnableLabel();
  const disableLabel = useDisableLabel();

  const handleCheckboxChange = (labelId: string, enabled: boolean) => {
    if (enabled) {
      enableLabel(labelId);
    } else {
      disableLabel(labelId);
    }
  };

  return (
    <ListItem key={label.id} py={2} px={1} borderRadius="xs" {...listItemProps}>
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
              <LabelMenu label={label} />
              <LabelBadge label={label} />
            </Flex>
          )}
        </Grid>
      </Checkbox>
    </ListItem>
  );
}
