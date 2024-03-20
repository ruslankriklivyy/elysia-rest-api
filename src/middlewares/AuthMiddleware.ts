import { Elysia } from "elysia";

import { ExtendedContext } from "@/types/common/ExtendedContext";
import UserService from "@/services/UserService";
import TokenService from "@/services/TokenService";

export const AuthMiddleware = (app: Elysia) =>
  app.derive(async (context) => {
    const { jwt, cookie, set } = context as unknown as ExtendedContext;

    try {
      const accessToken = cookie?.access_token;
      const { data: user } = await jwt.verify(accessToken);

      if (!user) throw Error();

      const userById = await UserService.findOne({ email: user.email });

      if (!userById || !accessToken) throw Error();

      const token = await TokenService.findOne({ accessToken });

      if (!token) throw Error();

      return {
        user: userById,
      };
    } catch (error) {
      console.error(error);
      set.status = 401;
      throw Error("Unauthorized");
    }
  });
