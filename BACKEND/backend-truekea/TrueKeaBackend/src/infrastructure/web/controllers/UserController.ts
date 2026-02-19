// src/infrastructure/web/controllers/UserController.ts
import { Request as ExpressRequest, Response } from "express";
import { getRepository, In } from "typeorm";
import { UserEntity } from "../../adapter/typeorm/entities/UserEntity";
import { ItemEntity } from "../../adapter/typeorm/entities/ItemEntity";
import { SwapEntity } from "../../adapter/typeorm/entities/SwapEntity";
import { RatingEntity } from "../../adapter/typeorm/entities/RatingEntity";
import RegisterUser from "../../../application/user/RegisterUser";
import ListUserStats from "../../../application/user/ListUserStats";
import UpdateUserProfile from "../../../application/user/UpdateUserProfile";
import { DeactivateUser } from "../../../application/user/DeactivateUser";
import { UserRepository } from "../../adapter/typeorm/repositories/UserRepository";

export interface AuthenticatedRequest extends ExpressRequest {
  userId: number;
}

function toSafeUserDto(u: UserEntity) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    roleId: u.roleId ? { id: u.roleId.id, name: u.roleId.name } : u.roleId,
    status_user: u.status_user,
    phone: u.phone ?? undefined,
    location: u.location ?? undefined,
    bio: u.bio ?? undefined,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export default {
  async register(req: ExpressRequest, res: Response) {
    try {
      const dto = req.body;
      const user = await new RegisterUser().execute(dto);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async list(req: ExpressRequest, res: Response) {
    try {
      const repo = getRepository(UserEntity);
      const users = await repo.find({ relations: ["roleId"] });
      return res.json(users.map(toSafeUserDto));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getById(req: ExpressRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const repo = getRepository(UserEntity);
      const found = await repo.findOne({
        where: { id },
        relations: ["roleId"],
      });
      if (!found) return res.status(404).json({ message: "Usuario no encontrado" });
      return res.json(toSafeUserDto(found));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async deleteUser(req: ExpressRequest, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const userRepository = new UserRepository();
      const deactivateUser = new DeactivateUser(userRepository);
      const user = await deactivateUser.execute(userId);
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async listStats(req: ExpressRequest, res: Response) {
    try {
      const stats = await new ListUserStats().execute();
      return res.json(stats);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const dto = {
        id: String(req.userId),
        name: req.body?.name,
        email: req.body?.email,
        password: req.body?.password,
        phone: req.body?.phone,
        location: req.body?.location,
        bio: req.body?.bio,
      };
      const user = await new UpdateUserProfile().execute(dto);
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async deactivateUser(req: ExpressRequest, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const userRepository = new UserRepository();
      const deactivateUser = new DeactivateUser(userRepository);
      const user = await deactivateUser.execute(userId);
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async activateUser(req: ExpressRequest, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const userRepository = new UserRepository();
      const user = await userRepository.findById(userId);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      user.status_user = "active";
      const updated = await userRepository.update(user);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getUserStatsByUserId(req: ExpressRequest, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) return res.status(400).json({ message: "userId inválido" });

      const itemRepo = getRepository(ItemEntity);
      const swapRepo = getRepository(SwapEntity);
      const ratingRepo = getRepository(RatingEntity);

      const totalItems = await itemRepo.count({ where: { owner: { id: userId } } });

      const completedSwaps = await swapRepo
        .createQueryBuilder("swap")
        .where("(swap.requesterId = :userId OR swap.respondentId = :userId)", { userId })
        .andWhere("swap.status = :status", { status: "completed" })
        .getCount();

      const itemsWithCategory = await itemRepo.find({
        where: { owner: { id: userId } },
        relations: ["category"],
      });
      const totalCO2Saved = itemsWithCategory.reduce((sum, i) => sum + (Number(i.category?.co2) || 0), 0);

      const ratingsReceived = await ratingRepo
        .createQueryBuilder("rating")
        .innerJoin("rating.swap", "swap")
        .where("(swap.requesterId = :userId OR swap.respondentId = :userId)", { userId })
        .andWhere("rating.raterId != :userId", { userId })
        .select("AVG(rating.score)", "avg")
        .getRawOne();
      const rating = ratingsReceived?.avg != null ? Math.round(parseFloat(ratingsReceived.avg) * 10) / 10 : 0;

      return res.json({
        totalItems,
        completedSwaps,
        totalCO2Saved,
        rating,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getTopUsers(req: ExpressRequest, res: Response) {
    try {
      const limit = Math.min(parseInt(String(req.query?.limit || "10"), 10) || 10, 20);
      const swapRepo = getRepository(SwapEntity);
      const userRepo = getRepository(UserEntity);
      const itemRepo = getRepository(ItemEntity);

      const completedByUser = await swapRepo
        .createQueryBuilder("swap")
        .select("swap.requesterId", "userId")
        .where("swap.status = :status", { status: "completed" })
        .getRawMany()
        .then((rows) => rows.map((r) => r.userId));
      const completedByRespondent = await swapRepo
        .createQueryBuilder("swap")
        .select("swap.respondentId", "userId")
        .where("swap.status = :status", { status: "completed" })
        .getRawMany()
        .then((rows) => rows.map((r) => r.userId));
      const allIds = [...completedByUser, ...completedByRespondent];
      const countByUser: Record<number, number> = {};
      allIds.forEach((id) => { countByUser[id] = (countByUser[id] || 0) + 1; });
      const sorted = Object.entries(countByUser)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => parseInt(id, 10));

      if (sorted.length === 0) {
        const anyUsers = await userRepo.find({ take: limit, relations: ["roleId"] });
        const result = await Promise.all(
          anyUsers.map(async (u) => {
            const items = await itemRepo.find({ where: { owner: { id: u.id } }, relations: ["category"] });
            const co2 = items.reduce((s, i) => s + (Number(i.category?.co2) || 0), 0);
            const initials = u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
            return { id: u.id, name: u.name, swaps: 0, co2: Math.round(co2), avatar: initials };
          })
        );
        return res.json(result);
      }

      const users = await userRepo.find({ where: { id: In(sorted) }, relations: ["roleId"] });
      const result = await Promise.all(
        users.map(async (u) => {
          const items = await itemRepo.find({ where: { owner: { id: u.id } }, relations: ["category"] });
          const co2 = items.reduce((s, i) => s + (Number(i.category?.co2) || 0), 0);
          const initials = u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          return {
            id: u.id,
            name: u.name,
            swaps: countByUser[u.id] || 0,
            co2: Math.round(co2),
            avatar: initials,
          };
        })
      );
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
