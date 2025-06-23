// application/auth/RefreshToken.ts
import jwt from "jsonwebtoken";
import config from "../../infrastructure/config/default";

export default class RefreshToken {
  async execute(
    token: string
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      const payload = jwt.verify(token, config.jwt.refreshSecret) as {
        sub: string;
      };
      const userId = payload.sub;

      const newToken = jwt.sign({ sub: userId }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as unknown as number,
      });

      const newRefresh = jwt.sign({ sub: userId }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn as unknown as number,
      });

      return {
        token: newToken,
        refreshToken: newRefresh,
      };
    } catch (err: any) {
      throw new Error(err.message || "Invalid refresh token");
    }
  }
}
