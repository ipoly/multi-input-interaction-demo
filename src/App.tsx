import { Container, Title, Text, Stack, Paper, Group } from "@mantine/core";
import { HoverMenuDemo } from "./components/HoverMenuDemo";

function App() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <header>
          <Title order={1}>多输入模式交互 Demo</Title>
          <Text c="dimmed" mt="xs">
            演示如何让 UI 组件同时支持鼠标、键盘和触摸输入
          </Text>
        </header>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={3}>悬停菜单</Title>
              <Text size="sm" c="dimmed" mt="xs">
                鼠标悬停或触摸点击显示操作菜单
              </Text>
            </div>
            <HoverMenuDemo />
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}

export default App;
