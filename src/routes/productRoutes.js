import { Router } from "express";
const productRouter = Router();
import {
  assignNewBuyer,
  buyProduct,
  cancleProduct,
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
} from "../controllers/productControllers.js";
import uploadImage from "../middleware/uploadImage.js";

productRouter.get("/", getProduct);
productRouter.post("/create", uploadImage, createProduct);
productRouter.put("/edit", editProduct);
productRouter.put("/buy", buyProduct);
productRouter.delete("/delete", deleteProduct);
productRouter.put("/cancle", cancleProduct);
productRouter.put("/new-buyer", assignNewBuyer);

export default productRouter;
