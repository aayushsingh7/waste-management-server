import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectToDB from "./database/connection.js";
import productRouter from "./routes/productRoutes.js";
import rewardRouter from "./routes/rewardRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cloudinary from "cloudinary";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectToDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ["https://earn-more.netlify.app"] }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/rewards", rewardRouter);
const httpServer = createServer(app);
const userSockets = new Map();
const io = new Server(httpServer, {
  cors: {
    origin: ["https://earn-more.netlify.app"],
    credentials: true,
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  socket.on("user_connect", (userId) => {
    userSockets.set(userId, socket.id);
  });

  socket.on("new_request", (product, [sellerId, buyerId]) => {
    const sellerSocketId = userSockets.get(sellerId);
    const buyerSocketId = userSockets.get(buyerId);

    if (sellerSocketId) {
      io.to(sellerSocketId).emit("new_request_received", product);
    }
    if (buyerSocketId) {
      io.to(buyerSocketId).emit("new_request_received", product);
    }
  });

  socket.on("transaction_completed", (requestId, [sellerId, buyerId]) => {
    const sellerSocketId = userSockets.get(sellerId);
    const buyerSocketId = userSockets.get(buyerId);

    if (sellerSocketId) {
      io.to(sellerSocketId).emit("transaction_completed_noti", requestId);
    }
    if (buyerSocketId) {
      io.to(buyerSocketId).emit("transaction_completed_noti", requestId);
    }
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
