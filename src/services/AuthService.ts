import { PrismaClient } from "@prisma/client";

import type { SignInPayload } from "@/types/entities/auth/SignInPayload";
import TokenService from "./TokenService";

class AuthService {
  private readonly prisma = new PrismaClient();

  async signIn({ user, password, jwtAccessToken }: SignInPayload) {
    try {
      const isPasswordsMatch = await Bun.password.verify(
        password,
        user.password
      );

      if (!isPasswordsMatch) throw Error("User password or email is wrong");

      await TokenService.create({
        userId: user.id,
        jwtAccessToken,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        access_token: jwtAccessToken,
      };
    } catch (error) {
      throw new Error("User doesn't sign in");
    }
  }

  async logout(accessToken: string) {
    try {
      const token = await this.prisma.token.findFirst({
        where: { access_token: accessToken },
      });

      if (!token) return;

      await this.prisma.token.delete({ where: { id: token.id } });

      return "User is logout";
    } catch (error) {
      console.log("error: ", error);
      throw new Error("User doesn't logout");
    }
  }
}

export default new AuthService();
