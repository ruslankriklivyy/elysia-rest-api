import { Elysia } from "elysia";

import AuthController from "@/controllers/AuthController";

export const createAuthRoutes = (app: Elysia<"/api/auth">) => {
  return app
    .post("/sign-up", AuthController.signUp)
    .post("/sign-in", AuthController.signIn)
    .post("/logout", AuthController.logout);
};
