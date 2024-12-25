import { Router } from "express";
const productRouter = Router();
import {
  buyProduct,
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
} from "../controllers/productControllers.js";

productRouter.get("/", getProduct);
productRouter.post("/create", createProduct);
productRouter.put("/edit", editProduct);
productRouter.put("/buy", buyProduct);
productRouter.delete("/delete", deleteProduct);

export default productRouter;
