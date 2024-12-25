import { startSession } from "mongoose";
import Product from "../database/models/productModel.js";
import User from "../database/models/userModel.js";

export const getProduct = async (req, res) => {
  const { productId, buyerId, sellerId } = req.query;
  let products;
  try {
    if (productId) {
      products = await Product.findOne({ _id: productId });
    } else if (sellerId) {
      products = await Product.find({ seller: sellerId });
    } else if (buyerId) {
      products = await Product.find({ buyer: buyerId });
    } else if (status) {
      products = await Product.find(
        sellerId && status
          ? { status, seller: sellerId }
          : { status, buyer: buyerId }
      );
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Invalid search query" });
    }

    res.status(200).send({
      success: true,
      message: "Products fetched successfully",
      products: products,
    });
  } catch (err) {
    console.log(err);
    res.status({ success: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  const { seller, name, location, expectedPrice, description, image, items } =
    req.body;
  try {
    const newProduct = new Product({
      seller,
      name,
      location,
      description,
      image,
      items: JSON.parse(items),
      expectedPrice: parseInt(expectedPrice),
    });

    await newProduct.save();
    if (newProduct) {
      res.status(201).send({
        success: true,
        message: "New product created successfully",
        data: newProduct,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Bad Request! cannot create new Product at this moment",
      });
    }
  } catch (err) {
    console.log(err);
    res.status({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.query;
  try {
    const product = await Product.deleteOne({ _id: productId });
    if (product.acknowledged) {
      res
        .status(200)
        .send({ success: true, message: "Product deleted successfully" });
    } else {
      res.status(400).send({
        success: false,
        message: "Bad Request! cannot delete product at this moment",
      });
    }
  } catch (err) {
    console.log(err);
    res.status({ success: false, message: err.message });
  }
};

export const buyProduct = async (req, res) => {
  const { buyerId, productId, sellerId, finalPrice } = req.query;
  let coinValue = 0;

  const session = await startSession();
  session.startTransaction();

  try {
    await Product.updateOne(
      { _id: productId },
      { $set: { buyer: buyerId, finalPrice: finalPrice } },
      { session }
    );

    coinValue = Math.max(Math.floor(finalPrice * (5 / 100) * 100), 10);

    await User.updateOne(
      { _id: sellerId },
      { $inc: { coins: coinValue } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).send({ success: true, message: "Transaction successfull" });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(500).send({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

export const editProduct = async (req, res) => {
  const { productId, newData } = req.body;
  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      {
        $set: newData,
      },
      { new: true }
    );
    if (product.acknowledged) {
      res.status(200).send({
        success: true,
        message: "Product edited successfully",
        data: reward,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Bad Request! cannot edit product at this moment",
      });
    }
  } catch (err) {
    console.log({ err });
    res.status(500).send({ success: false, message: err.message });
  }
};
