import { Router } from "express";
const rewardRouter = Router();
import {
  createdReward,
  deleteReward,
  editReward,
  fetchRewards,
} from "../controllers/rewardControllers.js";

rewardRouter.get("/", fetchRewards);
rewardRouter.delete("/delete", deleteReward);
rewardRouter.post("/create", createdReward);
rewardRouter.put("/edit", editReward);

export default rewardRouter;
