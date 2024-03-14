import { PrismaClient, Prisma } from "@prisma/client";

import generatePasswordHash from "@/helpers/generatePasswordHash";
import type { CreateUser } from "@/types/entities/user/CreateUser";

interface UserFindOnePayload {
  userId?: number;
  email?: string;
}

interface UserCreateOnePayload {
  data: CreateUser;
}

class UserService {
  private readonly prisma = new PrismaClient();

  findAll = () => {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  };

  findOne = ({ userId, email }: UserFindOnePayload) => {
    const where = {} as Prisma.UserWhereUniqueInput;

    if (userId) {
      where["id"] = userId;
    }
    if (email) {
      where["email"] = email;
    }

    return this.prisma.user.findUnique({ where });
  };

  create = async ({ data }: UserCreateOnePayload) => {
    const hashedPassword = await generatePasswordHash(data.password);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return newUser;
  };
}

export default new UserService();
