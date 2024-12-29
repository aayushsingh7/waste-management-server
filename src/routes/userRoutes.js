import { Router } from "express";
const userRouter = Router();
import {
  authenticateUser,
  login,
  logout,
  register,
} from "../controllers/userControllers.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

userRouter.put("/login", login);
userRouter.post("/register", register);
userRouter.delete("/logout", logout);
userRouter.get("/auth", authenticateJWT, authenticateUser);

export default userRouter;
