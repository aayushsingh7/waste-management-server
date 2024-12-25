import { Router } from "express";
const userRouter = Router();
import {
  authenticateUser,
  login,
  logout,
  register,
} from "../controllers/userControllers.js";

userRouter.put("/login", login);
userRouter.post("/register", register);
userRouter.delete("/logout", logout);
userRouter.get("/auth", authenticateUser);

export default userRouter;
