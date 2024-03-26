import { Server } from "socket.io";

import { checkAuth } from "@/helpers/checkAuth";
import buildSocketRooms from "@/helpers/buildSocketRooms";

export const createSocket = () => {
  const io = new Server({ cors: { origin: true } });

  io.on("connection", async (socket) => {
    try {
      const accessToken = socket.handshake.auth?.["access_token"];
      if (!accessToken) throw Error("Access token not provided");
      const { user } = await checkAuth(accessToken);

      buildSocketRooms(socket, user.id);
    } catch (error) {
      socket.disconnect();
    }
  });

  io.use(async (socket, next) => {
    try {
      const accessToken = socket.handshake.auth?.["access_token"];
      if (!accessToken) throw Error("Access token not provided");
      await checkAuth(accessToken);
      next();
    } catch (error) {
      socket.disconnect();
    }
  });

  io.listen(Number(process.env.WS_PORT) || 3001);

  return io;
};
