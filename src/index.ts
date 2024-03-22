import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { cors } from "@elysiajs/cors";

import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { createSocket } from "./core/socket";
import { createTaskRoutes } from "./routes/TaskRoutes";
import { createChatsRoutes } from "./routes/ChatRoutes";
import { createMessageRoutes } from "./routes/MessageRoutes";
import { createUserRoutes } from "./routes/UserRoutes";
import { createFileRoutes } from "./routes/FileRoutes";
import { createNotificationRoutes } from "./routes/NotificationRoutes";
import { createAuthRoutes } from "@/routes/AuthRoutes";
import AuthController from "@/controllers/AuthController";

const app = new Elysia();
const socket = createSocket();

// CORS options
app
  .onAfterHandle(({ request, set }) => {
    if (request.method !== "OPTIONS") return;

    const allowHeader = set.headers["Access-Control-Allow-Headers"];
    if (allowHeader === "*") {
      set.headers["Access-Control-Allow-Headers"] =
        request.headers.get("Access-Control-Request-Headers") ?? "";
    }
  })
  .use(
    cors({
      origin: true,
      methods: "*",
      allowedHeaders: "*",
      exposedHeaders: "*",
      credentials: true,
    })
  );

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
      .post("/auth/logout", AuthController.logout)
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
