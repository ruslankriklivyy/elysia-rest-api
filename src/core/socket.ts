import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import UserService from "@/services/UserService";
import TokenService from "@/services/TokenService";

export const createSocket = () => {
  const io = new Server({
    cookie: true,
  });

  io.on("connection", (socket) => {
    console.log("Websockets is running!");
  });

  io.use(async (socket, next) => {
    const accessToken = socket.handshake.headers.authorization;

    if (!accessToken) return socket.disconnect();

    const jwtData = jwt.verify(accessToken, process.env.JWT_SECRET || "test", {
      algorithms: ["HS256"],
    });

    if (!jwtData) return socket.disconnect();

    const userById = await UserService.findOne({
      email: (jwtData as any)?.data?.email,
    });

    if (!userById || !accessToken) return socket.disconnect();

    const token = await TokenService.findOne({ accessToken });

    if (!token) return socket.disconnect();

    next();
  });

  io.listen(Number(process.env.WS_PORT) || 3001);

  return io;
};
