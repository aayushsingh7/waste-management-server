import { Schema, model } from "mongoose";

const rewardSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    rewardType: {
      type: String,
      enum: ["giftCard", "coupon", "cashback"],
      required: true,
    },
    coinsRequired: { type: Number, default: 0 },
    rewardValue: {
      type: Number,
      required: true,
    },
    rewardCurrency: {
      type: String,
      enum: ["USD", "HKD"],
      default: "HKD",
    },
    status: {
      type: String,
      enum: ["available", "unAvailable"],
      default: "available",
    },
    totalTimesRedeemed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Reward = model("reward", rewardSchema);

export default Reward;
