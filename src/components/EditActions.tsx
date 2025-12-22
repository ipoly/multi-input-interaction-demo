import { ActionIcon, Group } from "@mantine/core";
import classes from "./CategoryItem.module.css";

interface EditActionsProps {
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function EditActions({ onCancel, onConfirm }: EditActionsProps) {
  return (
    <Group gap={4} className={classes.editActions}>
      <ActionIcon
        variant="default"
        color="gray"
        onClick={onCancel}
        aria-label="Cancel"
        size="md"
      >
        ✕
      </ActionIcon>
      <ActionIcon
        variant="default"
        color="gray"
        onClick={onConfirm}
        aria-label="Confirm"
        size="md"
      >
        ✓
      </ActionIcon>
    </Group>
  );
}
