import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";

import AuthController from "@/controllers/AuthController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { createSocket } from "./core/socket";
import { createTaskRoutes } from "./routes/TaskRoutes";
import { createChatsRoutes } from "./routes/ChatRoutes";

const socket = createSocket();

const app = new Elysia()
  .group("/api", (app) =>
    app
      .use(
        jwt({
          name: "jwt",
          secret: "test",
        })
      )
      .use(cookie())
      .group("/auth", (app) =>
        app
          .post("/sign-up", AuthController.signUp)
          .post("/sign-in", AuthController.signIn)
          .post("/logout", AuthController.logout)
      )
      .use(AuthMiddleware)
      .group("/tasks", (app) => createTaskRoutes(app, socket))
      .group("/chats", (app) => createChatsRoutes(app, socket))
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
