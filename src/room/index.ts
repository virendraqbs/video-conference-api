import { Socket } from "socket.io";
import { v4 } from "uuid";
interface IUser {
  peerId: string;
  username: string;
}
const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};

interface IRoomParams {
  roomId: string;
  peerId: string;
}

interface IJoinRoomParams extends IRoomParams {
  username: string;
}
interface IMessage {
  content: string;
  author: string;
  timestamp: number;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = v4();
    rooms[roomId] = {};

    socket.emit("room-created", { roomId });
  };
  const joinRoom = ({ roomId, peerId, username }: IJoinRoomParams) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);
    rooms[roomId][peerId] = { peerId, username };
    socket.join(roomId);
    console.log("user joined room", roomId, peerId, username);
    socket.to(roomId).emit("user-joined", { peerId, username });
    socket.emit("get-users", { roomId, participants: rooms[roomId] });

    socket.on("disconnect", () => {
      leaveRoom({ roomId, peerId });
    });
  };
  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    // rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  const startSharing = ({ peerId, roomId }: IRoomParams) => {
    socket.to(roomId).emit("user-started-sharing", peerId);
  };
  const stopSharing = (roomId: string) => {
    socket.to(roomId).emit("user-stopped-sharing");
  };
  const addMessage = (roomId: string, message: IMessage) => {
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit("add-message", message);
  };
  const changeName = ({
    peerId,
    username,
    roomId,
  }: {
    peerId: string;
    username: string;
    roomId: string;
  }) => {
    if (rooms[roomId] && rooms[roomId][peerId]) {
      rooms[roomId][peerId].username = username;
      socket.to(roomId).emit("name-changed", { peerId, username });
    }
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
};
