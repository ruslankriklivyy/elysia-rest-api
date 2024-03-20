import { Server } from "socket.io";

export const createSocket = () => {
  const PORT = Number(process.env.WS_PORT) || 3001;
  const io = new Server({
    cookie: true,
  });

  io.on("connection", (socket) => {
    console.log("Websockets is running!");
  });

  io.listen(PORT);

  return io;
};
