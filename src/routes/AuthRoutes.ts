import { Elysia } from "elysia";

import AuthController from "@/controllers/AuthController";
import SignUpValidation from "@/helpers/validations/auth/SignUpValidation";
import SignInValidation from "@/helpers/validations/auth/SignInValidation";

export const createAuthRoutes = (app: Elysia<"/api/auth">) => {
  return app
    .post("/sign-up", AuthController.signUp, { body: SignUpValidation })
    .post("/sign-in", AuthController.signIn, { body: SignInValidation });
};
