// src/infrastructure/web/controllers/UserController.ts
import { Request as ExpressRequest, Response } from "express";
import RegisterUser from "../../../application/user/RegisterUser";
import ListUserStats from "../../../application/user/ListUserStats";
import UpdateUserProfile from "../../../application/user/UpdateUserProfile";
import { DeactivateUser } from "../../../application/user/DeactivateUser";
import { UserRepository } from "../../adapter/typeorm/repositories/UserRepository";

export interface AuthenticatedRequest extends ExpressRequest {
  userId: number;
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
      const dto = { id: req.userId, ...req.body };
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
};
