import { Socket } from "socket.io";

import { NotifiableType } from "@/enums/NotifiableType";

export default function buildSocketRooms(socket: Socket, userId: number) {
  for (const notifiableType of Object.values(NotifiableType)) {
    socket.join(`${notifiableType}.${userId}`);
  }
}
