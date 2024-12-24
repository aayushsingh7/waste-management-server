import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "user" },
    receiver: { type: Schema.Types.ObjectId, ref: "user" },
    title: { type: String, required: true },
    isReward: { type: Boolean, default: false },
    rewardValue: { type: Number, default: 0 },
    description: { type: String },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dvk80x6fi/image/upload/v1734980278/default-placeholder_b5gntk.png",
    },
  },
  { timestamps: true }
);

const Notification = model("notification", notificationSchema);

export default Notification;
