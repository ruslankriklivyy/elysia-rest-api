import { PrismaClient } from "@prisma/client";

import UserService from "@/services/UserService";

interface CreateTokenPayload {
  userId: number;
  jwtAccessToken: string;
}

interface FindOneTokenPayload {
  accessToken?: string;
}

class TokenService {
  private readonly prisma = new PrismaClient();

  async create({ userId, jwtAccessToken }: CreateTokenPayload) {
    const user = await UserService.findOne({ userId });

    if (!user) throw new Error("User not found");

    return this.prisma.token.create({
      data: {
        user_id: user.id,
        access_token: jwtAccessToken,
      },
    });
  }

  findOne = ({ accessToken }: FindOneTokenPayload) => {
    return this.prisma.token.findFirst({
      where: { access_token: accessToken },
    });
  };
}

export default new TokenService();
