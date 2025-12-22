import { useState } from "react";
import { Container, Title, Text, Stack, Paper } from "@mantine/core";
import { CategoryList } from "./components/CategoryList";
import type { CategoryGroup } from "./components/CategoryList";

const initialCategories: CategoryGroup[] = [
  {
    title: "Expense categories",
    items: [
      { id: "1", name: "Auto and Transport" },
      { id: "2", name: "Bill and Utilities" },
      { id: "3", name: "Business" },
      { id: "4", name: "Chartitable Giving" },
      { id: "5", name: "Dining Out" },
      { id: "6", name: "Education" },
      { id: "7", name: "Entertainment" },
      { id: "8", name: "Fees and Charges" },
      { id: "9", name: "Gift" },
      { id: "10", name: "Groceries" },
      { id: "11", name: "Kids" },
      { id: "12", name: "Loan Payment" },
      { id: "13", name: "Misc" },
      { id: "14", name: "Shopping" },
      { id: "15", name: "Travel" },
      { id: "16", name: "Uncategorized" },
    ],
  },
  {
    title: "Income categories",
    items: [
      { id: "17", name: "Other Income" },
      { id: "18", name: "Paychecks" },
      { id: "19", name: "Untitled" },
    ],
  },
  {
    title: "Other categories",
    items: [
      { id: "20", name: "Excluded from Budget" },
      { id: "21", name: "Transfer" },
      { id: "22", name: "Newly created" },
      { id: "23", name: "Untitled" },
    ],
  },
];

function App() {
  const [categories, setCategories] = useState<CategoryGroup[]>(initialCategories);

  const handleRename = (id: string, newName: string) => {
    setCategories((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === id ? { ...item, name: newName } : item
        ),
      }))
    );
  };

  const handleDelete = (id: string) => {
    setCategories((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.id !== id),
      }))
    );
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <header>
          <Title order={1}>Multi-Input Interaction Demo</Title>
          <Text c="dimmed" mt="xs">
            Demonstrating UI components that support mouse, keyboard, and touch input
          </Text>
        </header>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} mb="md">Category List</Title>
          <CategoryList
            groups={categories}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </Paper>
      </Stack>
    </Container>
  );
}

export default App;
