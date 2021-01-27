import type http from "http";
import { Server, Socket } from "socket.io";
import User from "../shared/User";
import {gameState, addPlayer, removePlayer, codeToGameState, getAllPlayers} from "./logic";
let io: Server;

const userToSocketMap: Map<string, Socket> = new Map<string, Socket>(); // maps user ID to socket object
const socketToUserMap: Map<string, User> = new Map<string, User>(); // maps socket ID to user object

export const getAllConnectedUsers = () => Array.from(socketToUserMap.values());
export const getSocketFromUserID = (userid: string) => userToSocketMap.get(userid);
export const getUserFromSocketID = (socketid: string) => socketToUserMap.get(socketid);
export const getSocketFromSocketID = (socketid: string) => io.sockets.sockets.get(socketid);

export const addUser = (user: User, socket: Socket, code:string): void => {
  const oldSocket = userToSocketMap.get(user._id);
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // TODO(weblab student): is this the behavior you want?
    oldSocket.disconnect();
    socketToUserMap.delete(oldSocket.id);
  }
  userToSocketMap.set(user._id, socket);
  socketToUserMap.set(socket.id, user);

  addPlayer(user.name, user._id, code);
  // TODO: add multiple rooms
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() , activePlayers:getAllPlayers(), gameCode:code});
};

export const removeUser = (user: User, socket: Socket, code: string): void => {
  if (user) userToSocketMap.delete(user._id);
  socketToUserMap.delete(socket.id);
  //TODO: add multiple rooms
  let playerCode = "";
  codeToGameState.forEach((value, key)=>{
    for (let i = 0; i < value.playerList.length; i++) {
      if (value.playerList[i]._id === user._id) {
        playerCode = key;
      }
    }
  })
  removePlayer(user._id, playerCode);
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() , activePlayers:getAllPlayers(), gameCode:playerCode});
};


export const init = (server: http.Server): void => {
  io = new Server(server);
  io.on("connection", (socket) => {
    console.log(`socket has connected ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`socket has disconnected ${socket.id}`);
      const user = getUserFromSocketID(socket.id);
      if (user !== undefined) removeUser(user, socket, "");
    });
  });
};

export const getIo = () => io;

export default {
  getIo,
  init,
  removeUser,
  addUser,
  getSocketFromSocketID,
  getUserFromSocketID,
  getSocketFromUserID,
  getAllConnectedUsers
};
