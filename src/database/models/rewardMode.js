import { Schema, model } from "mongoose";

const rewardSchema = new Schema({});

const Reward = model("reward", rewardSchema);

export default Reward;
