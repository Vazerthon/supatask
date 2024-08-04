import {
  Flex,
  Select,
  Badge,
  FlexProps,
  Text,
  IconButton,
} from "@chakra-ui/react";

import useLabelStore from "./useLabelStore";
import { Label } from "../../types/types";
import { CloseIcon } from "@chakra-ui/icons";

interface SelectLabelsProps extends FlexProps {
  selectedLabels: Label[];
  onSelectionChange: (labels: Label[]) => void;
}

export default function SelectLabels({
  selectedLabels,
  onSelectionChange,
  ...flexProps
}: SelectLabelsProps) {
  const { labels } = useLabelStore();

  const handleAddLabel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target.value) {
      return;
    }

    onSelectionChange(
      Array.from(
        new Set([
          ...selectedLabels,
          labels.find((label) => label.id === e.target.value)!,
        ])
      )
    );
  };

  const handleRemoveLabel = (label: Label) => {
    onSelectionChange(selectedLabels.filter((l) => l.id !== label.id));
  };

  return (
    <Flex {...flexProps} flexWrap="wrap">
      {selectedLabels.length > 0 && (
        <>
          {selectedLabels.map((label) => (
            <Flex
              key={label.id}
              borderRadius="md"
              alignItems="center"
              border="thin solid"
              p={1}
              mr={2}
              mt={2}
              maxW={32}
            >
              <Text noOfLines={1}>{label.text}</Text>
              <Badge
                w={4}
                h={4}
                minW={4}
                ml={2}
                borderRadius="50%"
                backgroundColor={label.color_hex}
              />
              <IconButton
                aria-label="Remove label"
                icon={<CloseIcon />}
                size="xs"
                ml={2}
                onClick={() => handleRemoveLabel(label)}
              />
            </Flex>
          ))}
        </>
      )}
      <Select placeholder="Select labels" mt={2} onChange={handleAddLabel}>
        {labels.map((label) => (
          <option key={label.id} value={label.id}>
            {label.text}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
