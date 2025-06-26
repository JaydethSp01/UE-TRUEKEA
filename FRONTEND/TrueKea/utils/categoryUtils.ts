import { Category } from "../hooks/useCategory";

export const getCategoryById = (
  id: number,
  categories: Category[]
): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};
