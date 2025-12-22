import { useRef, useState } from "react";
import {
  Box,
  Button,
  ActionIcon,
  Group,
  Tooltip,
  Text,
} from "@mantine/core";
import classes from "./HoverMenuDemo.module.css";

export function HoverMenuDemo() {
  const [touchFocused, setTouchFocused] = useState(false);
  const justTouchedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      justTouchedRef.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" && justTouchedRef.current) {
      justTouchedRef.current = false;
      if (!touchFocused) {
        e.preventDefault();
        setTouchFocused(true);
      }
    }
  };

  const handleBlur = () => {
    setTouchFocused(false);
  };

  const handleAction = (action: string) => {
    alert(`执行操作: ${action}`);
    setTouchFocused(false);
  };

  const showMenu = touchFocused;

  return (
    <Box
      className={classes.container}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onBlur={handleBlur}
      tabIndex={0}
      data-touch-focused={touchFocused || undefined}
    >
      <Box className={classes.content}>
        <Text fw={500}>列表项示例</Text>
        <Text size="sm" c="dimmed">
          悬停或触摸查看菜单
        </Text>
      </Box>

      <Group
        className={classes.menu}
        gap="xs"
        data-visible={showMenu || undefined}
      >
        <Tooltip label="编辑">
          <ActionIcon
            variant="subtle"
            onClick={() => handleAction("编辑")}
            aria-label="编辑"
          >
            ✏️
          </ActionIcon>
        </Tooltip>
        <Tooltip label="删除">
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleAction("删除")}
            aria-label="删除"
          >
            🗑️
          </ActionIcon>
        </Tooltip>
        <Button size="xs" onClick={() => handleAction("更多")}>
          更多
        </Button>
      </Group>
    </Box>
  );
}
