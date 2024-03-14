import { Server } from "socket.io";

export const createSocket = () => {
  const io = new Server({});

  io.on("connection", (socket) => {
    console.log("CONNECTED!!!");
  });
  io.listen(3001);

  return io;
};
