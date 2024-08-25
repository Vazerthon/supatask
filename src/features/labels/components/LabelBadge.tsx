import { Badge, BadgeProps, Text } from "@chakra-ui/react";
import { Label } from "../../../types/types";

interface LabelBadgeProps extends BadgeProps {
  label: Label;
}

export default function LabelBadge({ label, ...badgeProps }: LabelBadgeProps) {
  return (
    <Badge
      w={5}
      h={5}
      minW={5}
      minH={5}
      borderRadius="50%"
      borderColor={label.color_hex}
      borderWidth={2}
      backgroundColor="white"
      alignSelf="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      fontSize="xs"
      {...badgeProps}
    >
      <Text fontWeight="bold">{label.text[0]}</Text>
    </Badge>
  );
}
