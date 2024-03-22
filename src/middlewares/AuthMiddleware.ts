import { Elysia } from "elysia";

import { ExtendedContext } from "@/types/common/ExtendedContext";
import { checkAuth } from "@/helpers/checkAuth";

export const AuthMiddleware = (app: Elysia) =>
  app.derive(async (context) => {
    const { cookie, set } = context as unknown as ExtendedContext;

    try {
      const accessToken = cookie?.access_token;
      return await checkAuth(accessToken);
    } catch (error) {
      set.status = 401;
      throw Error("Unauthorized");
    }
  });
