import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["completed", "ongoing", "reposted", "returned"],
      default: "ongoing",
    },
    seller: { type: Schema.Types.ObjectId, ref: "user" },
    buyer: { type: Schema.Types.ObjectId, ref: "user", default: null },
    name: { type: String, required: true },
    location: { type: String, required: true },
    expectedPrice: { type: Number, default: 0 },
    description: { type: String },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dvk80x6fi/image/upload/v1734980278/default-placeholder_b5gntk.png",
    },
    items: [
      {
        name: { type: String },
        qty: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Product = model("product", productSchema);

export default Product;
