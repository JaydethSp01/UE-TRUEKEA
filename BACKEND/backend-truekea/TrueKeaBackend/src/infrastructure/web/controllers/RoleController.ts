// src/infrastructure/web/controllers/RoleController.ts
import { Request, Response } from "express";
import { RoleRepository } from "../../adapter/typeorm/repositories/RoleRepository";
import { CreateRole } from "../../../application/role/CreateRole";
import { GetAllRoles } from "../../../application/role/GetAllRoles";
import { GetRoleById } from "../../../application/role/GetRoleById";
import { UpdateRole } from "../../../application/role/UpdateRole";
import { DeleteRole } from "../../../application/role/DeleteRole";

const roleRepository = new RoleRepository();

export const RoleController = {
  async createRole(req: Request, res: Response) {
    try {
      const createRole = new CreateRole(roleRepository);
      const role = await createRole.execute(req.body);
      res.status(201).json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getRoles(req: Request, res: Response) {
    try {
      const getRoles = new GetAllRoles(roleRepository);
      const roles = await getRoles.execute();
      res.status(200).json(roles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getRoleById(req: Request, res: Response) {
    try {
      const getRole = new GetRoleById(roleRepository);
      const role = await getRole.execute(parseInt(req.params.id));
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateRole(req: Request, res: Response) {
    try {
      const updateRole = new UpdateRole(roleRepository);
      const role = await updateRole.execute(parseInt(req.params.id), req.body);
      res.status(200).json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteRole(req: Request, res: Response) {
    try {
      const deleteRole = new DeleteRole(roleRepository);
      const success = await deleteRole.execute(parseInt(req.params.id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
}; 