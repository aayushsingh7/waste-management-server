import { Schema, model } from "mongoose";

const rewardSchema = new Schema(
  {
    title:{type:String,required:true},
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
      default: "USD",
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
