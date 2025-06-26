// src/application/auth/AuthenticateUser.ts

import type { IUserRepository } from "../../domain/ports/IUserRepository";
import type { ICategoryRepository } from "../../domain/ports/ICategoryRepository";
import type { IItemRepository } from "../../domain/ports/IItemRepository";
import type AuthDTO from "../../domain/dtos/AuthDTO";
import type AuthResponseDTO from "../../domain/dtos/AuthResponseDTO";

import CarbonFootprintHelper from "../../infrastructure/web/utils/CarbonFootprintHelper";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import config from "../../infrastructure/config/default";

import { UserRepository } from "../../infrastructure/adapter/typeorm/repositories/UserRepository";
import { CategoryRepository } from "../../infrastructure/adapter/typeorm/repositories/CategoryRepository";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";
import type { Item } from "../../domain/entities/Item";

export default class AuthenticateUser {
  private userRepo: IUserRepository;
  private categoryRepo: ICategoryRepository;
  private itemRepo: IItemRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.categoryRepo = new CategoryRepository();
    this.itemRepo = new ItemRepository();
  }

  async execute(dto: AuthDTO): Promise<AuthResponseDTO> {
    // 1) Validar usuario
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new Error("Credenciales inválidas");
    }

    const payload = { sub: user.id.toString() };
    const signOpts: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
    };
    const token = jwt.sign(payload, config.jwt.secret as Secret, signOpts);
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret as Secret, {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
    });

    const prefs: number[] = await this.userRepo.getPreferences(user.id);
    const allCats = prefs.length === 0 ? await this.categoryRepo.findAll() : [];

    const categoryNameMap = new Map<number, string>(
      allCats.map((c) => [c.id, c.name])
    );

    const itemIds: number[] = prefs.length ? prefs : allCats.map((c) => c.id);
    const items: Item[] = await this.itemRepo.findByCategoryIds(itemIds);

    type BreakdownItem = {
      id: number;
      title: string;
      categoryId: number;
      categoryName: string;
      co2Unit: number;
      co2Total: number;
    };
    const breakdown: BreakdownItem[] = items.map((i) => {
      const categoryName = categoryNameMap.get(i.categoryId) ?? "";
      console.log(categoryName);
      const co2Unit = CarbonFootprintHelper.getProductCO2(categoryName) || 0;
      return {
        id: i.id,
        title: i.title,
        categoryId: i.categoryId,
        categoryName,
        co2Unit,
        co2Total: co2Unit,
      };
    });

    // 6) Calcular CO2 total y equivalencias
    const totalCO2 = breakdown.reduce((sum, x) => sum + x.co2Total, 0);
    const eq = CarbonFootprintHelper.calculateEquivalencies(totalCO2);

    // 7) Devolver el DTO completo
    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        statusUser: user.status_user,
        preferences: prefs,
      },
      categoriesIfNoPrefs: allCats.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      initialItems: breakdown,
      initialCO2: {
        totalCO2,
        treesNeeded: eq.treesNeeded,
        carKilometers: eq.carKilometers,
        lightBulbHours: eq.lightBulbHours,
        flightMinutes: eq.flightMinutes,
      },
    };
  }
}
