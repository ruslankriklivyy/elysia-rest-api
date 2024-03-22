import { Server } from "socket.io";

import { checkAuth } from "@/helpers/checkAuth";
import buildSocketRooms from "@/helpers/buildSocketRooms";

export const createSocket = () => {
  const io = new Server({ cors: { origin: true } });

  io.on("connection", () => {
    console.log("Socket connected");
  });

  io.use(async (socket, next) => {
    try {
      const accessToken = socket.handshake.auth?.["access_token"];

      if (!accessToken) throw Error("Access token not provided");

      const { user } = await checkAuth(accessToken);

      buildSocketRooms(socket, user.id);

      next();
    } catch (error) {
      socket.disconnect();
    }
  });

  io.listen(Number(process.env.WS_PORT) || 3001);

  return io;
};
