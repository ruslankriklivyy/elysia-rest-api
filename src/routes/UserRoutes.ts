import { Elysia } from "elysia";

import UserController from "@/controllers/UserController";

export const createUserRoutes = (app: Elysia<"/api/users">) => {
  return app
    .get("", UserController.findAll)
    .get("/:id", UserController.findOne);
};
