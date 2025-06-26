export default interface AuthResponseDTO {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    roleId: number;
    statusUser: string;
    preferences: number[];
  };
  categoriesIfNoPrefs: {
    id: number;
    name: string;
  }[];
  initialItems: Array<{
    id: number;
    title: string;
    categoryId: number;
    co2Unit: number;
    co2Total: number;
  }>;
  initialCO2: {
    totalCO2: number;
    treesNeeded: number;
    carKilometers: number;
    lightBulbHours: number;
    flightMinutes: number;
  };
}
