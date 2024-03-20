import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";

import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { createSocket } from "./core/socket";
import { createTaskRoutes } from "./routes/TaskRoutes";
import { createChatsRoutes } from "./routes/ChatRoutes";
import { createMessageRoutes } from "./routes/MessageRoutes";
import { createUserRoutes } from "./routes/UserRoutes";
import { createFileRoutes } from "./routes/FileRoutes";
import { createNotificationRoutes } from "./routes/NotificationRoutes";
import { createAuthRoutes } from "@/routes/AuthRoutes";

const app = new Elysia();
const socket = createSocket();

app
  .group("/api", (app) =>
    app
      .use(
        jwt({
          name: "jwt",
          secret: "test",
        })
      )
      .use(cookie())
      .group("/auth", (app) => createAuthRoutes(app))
      .use(AuthMiddleware)
      .group("/tasks", (app) => createTaskRoutes(app, socket))
      .group("/chats", (app) => createChatsRoutes(app, socket))
      .group("/messages", (app) => createMessageRoutes(app, socket))
      .group("/users", (app) => createUserRoutes(app))
      .group("/files", (app) => createFileRoutes(app))
      .group("/notifications", (app) => createNotificationRoutes(app, socket))
  )
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
