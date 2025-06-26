export type Item = {
  id: number;
  title: string;
  description: string;
  value: number;
  categoryId: number;
  ownerId: number;
  img_item: string;
  category: {
    id: number;
    name: string;
    co2: number;
  };
  owner: {
    id: number;
    name: string;
  };
  co2Unit: number;
  co2Total: number;
  co2Equivalencies: {
    treesNeeded: number;
    carKilometers: number;
    lightBulbHours: number;
    flightMinutes: number;
  };
  status: "available" | "pending" | "exchanged";
};
