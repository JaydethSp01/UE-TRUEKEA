export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  co2Factor: number; // kg CO2 por objeto aproximado
}

export const Categories: Category[] = [
  {
    id: "books",
    name: "Libros",
    icon: "book",
    color: "#8B5CF6",
    co2Factor: 2.5,
  },
  {
    id: "technology",
    name: "Tecnología",
    icon: "laptop",
    color: "#3B82F6",
    co2Factor: 15.0,
  },
  {
    id: "furniture",
    name: "Muebles",
    icon: "chair",
    color: "#F59E0B",
    co2Factor: 25.0,
  },
  {
    id: "clothes",
    name: "Ropa",
    icon: "shirt",
    color: "#EC4899",
    co2Factor: 8.0,
  },
  {
    id: "sports",
    name: "Deportes",
    icon: "basketball",
    color: "#10B981",
    co2Factor: 5.0,
  },
  {
    id: "home",
    name: "Hogar",
    icon: "home",
    color: "#F97316",
    co2Factor: 3.0,
  },
  {
    id: "toys",
    name: "Juguetes",
    icon: "toy-brick",
    color: "#EF4444",
    co2Factor: 2.0,
  },
  {
    id: "music",
    name: "Música",
    icon: "music",
    color: "#6366F1",
    co2Factor: 1.5,
  },
  {
    id: "art",
    name: "Arte",
    icon: "palette",
    color: "#8B5CF6",
    co2Factor: 4.0,
  },
  {
    id: "others",
    name: "Otros",
    icon: "more-horizontal",
    color: "#6B7280",
    co2Factor: 3.0,
  },
];

export const ItemConditions = [
  { id: "new", name: "Nuevo", color: "#10B981" },
  { id: "excellent", name: "Excelente", color: "#3B82F6" },
  { id: "good", name: "Bueno", color: "#F59E0B" },
  { id: "fair", name: "Regular", color: "#EF4444" },
  { id: "poor", name: "Malo", color: "#6B7280" },
];

export const getCategoryById = (id: string): Category | undefined => {
  return Categories.find((cat) => cat.id === id);
};

export const getConditionById = (id: string) => {
  return ItemConditions.find((cond) => cond.id === id);
};
