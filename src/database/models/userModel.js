import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      default: "user",
    },
    items: [{ type: Schema.Types.ObjectId, ref: "product" }],
    coins: { type: Number, default: 0 },
    rewards: [{ type: Schema.Types.ObjectId, ref: "reward" }],
    location: { type: String, default: "" },
    phoneNo: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

export default User;
