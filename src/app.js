import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectToDB from "./database/connection.js";

dotenv.config();
connectToDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
const httpServer = createServer(app);
const userSockets = new Map();
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  socket.on("user_connect", (userId) => {
    userSockets.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

httpServer.listen(process.env.PORT || 4000, () => {
  console.log(`Server started at PORT:${process.env.PORT || 4000}`);
});
