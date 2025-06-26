import GetAllCategories from "../../../application/category/GetAllCategories";

export interface CarbonCalculationResult {
  totalCO2: number;
  breakdown: Array<{
    product: string;
    category: string;
    co2Unitario: number;
    cantidad: number;
    co2Total: number;
  }>;
  equivalencies: {
    treesNeeded: number;
    carKilometers: number;
    lightBulbHours: number;
    flightMinutes: number;
  };
}

export interface ProductSearchResult {
  [productName: string]: number;
}

export default class CarbonFootprintHelper {
  private static DB: Record<string, number> = {};

  public static async loadDataFromDB(): Promise<void> {
    const all: Array<{ name: string; co2: number }> =
      await new GetAllCategories().execute();
    const map: Record<string, number> = {};
    for (const { name, co2 } of all) {
      map[name] = co2;
    }
    this.DB = map;
  }

  static searchProduct(productName: string): ProductSearchResult {
    const results: ProductSearchResult = {};
    const term = productName.toLowerCase();
    for (const [name, co2] of Object.entries(this.DB)) {
      if (name.toLowerCase().includes(term)) {
        results[name] = co2;
      }
    }
    return results;
  }

  static getProductCO2(productName: string): number | null {
    const co2 = this.DB[productName];
    return co2 !== undefined ? co2 : null;
  }

  static calculateTotalFootprint(
    products: Array<{ name: string; quantity: number }>
  ): CarbonCalculationResult {
    let totalCO2 = 0;
    const breakdown: CarbonCalculationResult["breakdown"] = [];
    for (const { name, quantity } of products) {
      const co2Unitario = this.getProductCO2(name);
      if (co2Unitario !== null) {
        const co2Total = co2Unitario * quantity;
        totalCO2 += co2Total;
        breakdown.push({
          product: name,
          category: name,
          co2Unitario,
          cantidad: quantity,
          co2Total,
        });
      }
    }
    return {
      totalCO2,
      breakdown,
      equivalencies: this.calculateEquivalencies(totalCO2),
    };
  }

  public static calculateEquivalencies(totalCO2: number) {
    return {
      treesNeeded: Math.round((totalCO2 / 22) * 100) / 100,
      carKilometers: Math.round((totalCO2 / 0.2) * 100) / 100,
      lightBulbHours: Math.round((totalCO2 / 0.01) * 100) / 100,
      flightMinutes: Math.round((totalCO2 / 0.25) * 100) / 100,
    };
  }

  static productExists(productName: string): boolean {
    return this.getProductCO2(productName) !== null;
  }

  static getSimilarCarbonFootprint(
    co2Value: number,
    tolerance: number = 2
  ): Array<{ name: string; co2: number }> {
    const results: Array<{ name: string; co2: number }> = [];
    for (const [name, co2] of Object.entries(this.DB)) {
      if (Math.abs(co2 - co2Value) <= tolerance) {
        results.push({ name, co2 });
      }
    }
    return results.sort(
      (a, b) => Math.abs(a.co2 - co2Value) - Math.abs(b.co2 - co2Value)
    );
  }

  static getDatabaseStats(): {
    totalProducts: number;
    averageCO2: number;
    maxCO2: { product: string; co2: number };
    minCO2: { product: string; co2: number };
  } {
    let totalProducts = 0;
    let totalCO2 = 0;
    let max = { product: "", co2: -Infinity };
    let min = { product: "", co2: Infinity };
    for (const [name, co2] of Object.entries(this.DB)) {
      totalProducts++;
      totalCO2 += co2;
      if (co2 > max.co2) max = { product: name, co2 };
      if (co2 < min.co2) min = { product: name, co2 };
    }
    return {
      totalProducts,
      averageCO2: totalProducts
        ? Math.round((totalCO2 / totalProducts) * 100) / 100
        : 0,
      maxCO2: max,
      minCO2: min,
    };
  }
}
