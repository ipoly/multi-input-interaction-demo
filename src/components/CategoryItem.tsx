import { useRef, useState, useEffect } from "react";
import {
  Box,
  ActionIcon,
  Group,
  Tooltip,
  Text,
  Menu,
  TextInput,
} from "@mantine/core";
import { useFocusReturn } from "@mantine/hooks";
import classes from "./CategoryItem.module.css";
import { EditActions } from "./EditActions";

interface CategoryItemProps {
  id: string;
  name: string;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  /** Force editing state (for debugging) */
  forceEditing?: boolean;
}

export function CategoryItem({ id, name, onRename, onDelete, forceEditing = false }: CategoryItemProps) {
  const [touchFocused, setTouchFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(forceEditing);
  const [editValue, setEditValue] = useState("");

  const justTouchedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const returnFocus = useFocusReturn({
    opened: isEditing,
    shouldReturnFocus: true,
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!touchFocused) return;

    const handleDocumentPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTouchFocused(false);
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
  }, [touchFocused]);

  // 点击外部时退出编辑态（移动端触摸不会触发 blur）
  useEffect(() => {
    if (!isEditing) return;

    const handleDocumentPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!forceEditing) {
          setIsEditing(false);
        }
        setEditValue("");
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
  }, [isEditing, forceEditing]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      justTouchedRef.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isEditing) return;

    const clickedOnContent = contentRef.current?.contains(e.target as Node);
    if (!clickedOnContent) return;

    if (e.pointerType === "touch") {
      if (justTouchedRef.current) {
        justTouchedRef.current = false;
        if (!touchFocused) {
          e.preventDefault();
          setTouchFocused(true);
          return;
        }
      }
    }

    enterEditing();
  };

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as Node | null;
    const container = e.currentTarget as Node;

    if (relatedTarget && container.contains(relatedTarget)) {
      return;
    }

    setTouchFocused(false);
    if (isEditing) {
      cancelEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      if (isEditing) {
        cancelEditing();
      }
      e.currentTarget.blur();
    } else if (e.key === "Enter" && !isEditing) {
      if (e.target === e.currentTarget) {
        enterEditing();
      }
    }
  };

  const enterEditing = () => {
    setEditValue(name);
    setIsEditing(true);
  };

  const confirmEditing = () => {
    if (editValue.trim() && editValue.trim() !== name) {
      onRename?.(id, editValue.trim());
    }
    if (!forceEditing) {
      setIsEditing(false);
      returnFocus();
    }
  };

  const cancelEditing = () => {
    if (!forceEditing) {
      setIsEditing(false);
      returnFocus();
    }
    setEditValue("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  const handleRenameAction = () => {
    enterEditing();
    setTouchFocused(false);
  };

  const handleDeleteAction = () => {
    onDelete?.(id);
    setTouchFocused(false);
  };

  return (
    <Box
      ref={containerRef}
      className={classes.container}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onContextMenu={(e) => e.preventDefault()}
      tabIndex={isEditing ? -1 : 0}
      data-touch-focused={touchFocused || undefined}
      data-editing={isEditing || undefined}
    >
      {isEditing ? (
        <>
          <TextInput
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className={classes.input}
            variant="unstyled"
            size="sm"
          />
          <EditActions onCancel={cancelEditing} onConfirm={confirmEditing} />
        </>
      ) : (
        <>
          <Box ref={contentRef} className={classes.content}>
            <Text size="sm">{name}</Text>
          </Box>

          <Group
            className={classes.menu}
            gap="xs"
            data-visible={touchFocused || undefined}
          >
            <Menu shadow="md" width={120} withinPortal={false}>
              <Menu.Target>
                <Tooltip label="More actions">
                  <ActionIcon variant="subtle" size="sm" aria-label="More actions" tabIndex={0}>
                    ⋮
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleRenameAction}>
                  Rename
                </Menu.Item>
                <Menu.Item color="red" onClick={handleDeleteAction}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </>
      )}
    </Box>
  );
}
