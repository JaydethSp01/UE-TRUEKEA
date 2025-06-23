// infrastructure/web/controllers/AuthController.ts
import { Request, Response } from "express";
import AuthenticateUser from "../../../application/auth/AuthenticateUser";
import RefreshToken from "../../../application/auth/RefreshToken";
import AuthDTO from "../../../domain/dtos/AuthDTO";

interface IAuthController {
  authenticate(req: Request, res: Response): Promise<Response>;
  refresh(req: Request, res: Response): Promise<Response>;
}

const AuthController: IAuthController = {
  async authenticate(req: Request, res: Response) {
    try {
      const dto = new AuthDTO(req.body.email, req.body.password);
      const tokens = await new AuthenticateUser().execute(dto);
      return res.json(tokens);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await new RefreshToken().execute(refreshToken);
      return res.json(tokens);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};

export default AuthController;
