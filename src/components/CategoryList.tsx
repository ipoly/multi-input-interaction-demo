import { Box, Text } from "@mantine/core";
import { CategoryItem } from "./CategoryItem";
import classes from "./CategoryList.module.css";

export interface CategoryItemData {
  id: string;
  name: string;
}

export interface CategoryGroup {
  title: string;
  items: CategoryItemData[];
}

interface CategoryListProps {
  groups: CategoryGroup[];
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
}

export function CategoryList({ groups, onRename, onDelete }: CategoryListProps) {
  return (
    <Box className={classes.container}>
      {groups.map((group) => (
        <Box key={group.title} className={classes.group}>
          <Text className={classes.groupTitle}>{group.title}</Text>
          <Box className={classes.grid}>
            {group.items.map((item) => (
              <CategoryItem
                key={item.id}
                id={item.id}
                name={item.name}
                onRename={onRename}
                onDelete={onDelete}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
