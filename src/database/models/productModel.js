import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["completed", "pending", "reposted", "cancelled"],
      default: "pending",
    },
    seller: { type: Schema.Types.ObjectId, ref: "user" },
    rejectedByBuyerId: [{ type: Schema.Types.ObjectId, ref: "user" }],
    finalPrice: { type: Number, default: 0 },
    buyer: { type: Schema.Types.ObjectId, ref: "user", default: null },
    name: { type: String, default: null },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    locationTxt: { type: String, required: true },
    expectedPrice: { type: Number, default: 0 },
    description: { type: String, default: null },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dvk80x6fi/image/upload/v1734980278/default-placeholder_b5gntk.png",
    },
    items: [
      {
        name: { type: String },
        qty: { type: String, default: "0" },
        price: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Product = model("product", productSchema);

export default Product;
