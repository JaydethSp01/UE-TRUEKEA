import { Request, Response } from "express";
import CreateUserPreference from "../../../application/user-preference/CreateUserPreference";
import CreateManyUserPreferences from "../../../application/user-preference/CreateManyUserPreferences";
import GetUserPreferences from "../../../application/user-preference/GetUserPreferences";
import DeleteAllUserPreferences from "../../../application/user-preference/DeleteAllUserPreferences";
import { UserPreference } from "../../../domain/entities/UserPreference";

const UserPreferenceController = {
  async create(req: Request, res: Response): Promise<Response> {
    const { userId, categoryId } = req.body;

    const pref = new UserPreference(0, userId, categoryId);
    const result = await new CreateUserPreference().execute(pref);

    return res.status(201).json(result);
  },

  async createMany(req: Request, res: Response): Promise<Response> {
    const { userId, categoryIds } = req.body;

    if (!Array.isArray(categoryIds))
      return res.status(400).json({ message: "categoryIds debe ser un array" });

    const prefs = categoryIds.map(
      (catId: number) => new UserPreference(0, userId, catId)
    );

    await new CreateManyUserPreferences().execute(prefs);
    return res.status(201).json({ message: "Preferencias guardadas" });
  },

  async findByUserId(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params.userId);
    const prefs = await new GetUserPreferences().execute(userId);
    return res.json(prefs);
  },

  async deleteAll(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params.userId);
    await new DeleteAllUserPreferences().execute(userId);
    return res.json({ message: "Preferencias eliminadas" });
  },
};

export default UserPreferenceController;
