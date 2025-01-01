import { startSession } from "mongoose";
import Product from "../database/models/productModel.js";
import User from "../database/models/userModel.js";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

export const getProduct = async (req, res) => {
  const { productId, buyerId, sellerId, status } = req.query;
  let products;
  try {
    if (productId) {
      products = await Product.findOne({ _id: productId })
        .populate({
          path: "seller",
          select: "phoneNo _id username locationTxt",
        })
        .populate({
          path: "buyer",
          select: "_id phoneNo username locationTxt",
        });
    } else if ((status && sellerId) || (status && buyerId)) {
      products = await Product.find(
        sellerId && status
          ? { status, seller: sellerId }
          : { status, buyer: buyerId }
      )
        .populate({
          path: "seller",
          select: "phoneNo _id username locationTxt",
        })
        .populate({
          path: "buyer",
          select: "_id phoneNo username locationTxt",
        });
    } else if (sellerId) {
      products = await Product.find({ seller: sellerId })
        .populate({
          path: "seller",
          select: "phoneNo _id username",
        })
        .populate({ path: "buyer", select: "phoneNo username" });
    } else if (buyerId) {
      products = await Product.find({ buyer: buyerId })
        .populate({
          path: "seller",
          select: "phoneNo _id username",
        })
        .populate({ path: "buyer", select: "phoneNo username" });
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
    res.status({ success: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  const {
    seller,
    name,
    locationTxt,
    location,
    description,
    cloudinaryImage,
    items,
  } = req.body;
  try {
    let buyers = await User.find({ role: "buyer" });
    const buyersWithDistance = buyers.map((buyer) => ({
      _id: buyer._id,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        buyer.location.latitude,
        buyer.location.longitude
      ),
    }));

    buyersWithDistance.sort((a, b) => a.distance - b.distance);
    const nearestBuyer = buyersWithDistance[0];
    const newProduct = new Product({
      seller: seller,
      buyer: nearestBuyer._id,
      location: JSON.parse(location),
      name,
      locationTxt,
      description,
      image: cloudinaryImage,
      items: JSON.parse(items),
    });

    await (
      await (
        await newProduct.save()
      ).populate({ path: "seller", select: "username phoneNo locationTxt" })
    ).populate({ path: "buyer", select: "username phoneNo" });
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
    res.status({ success: false, message: err.message });
  }
};

export const cancleProduct = async (req, res) => {
  try {
    const { buyerId, productId } = req.query;
    const productUpdate = await Product.updateOne(
      { _id: productId },
      {
        $set: { buyer: null, status: "pending" },
        $push: { rejectedByBuyerId: buyerId },
      }
    );

    const product = await Product.findOne({ _id: productId }).populate({
      path: "seller",
      select: "location",
    });
    // assign new buyer
    let data = await fetch(`${process.env.API_URL}/products/new-buyer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        sellerLocation: product.seller.location,
        productId: productId,
      }),
    });
    let updatedProduct = await data.json();
    res.status(200).send({
      success: true,
      message: "Request Cancled",
      response: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Oops! something went wrong" });
  }
};

export const assignNewBuyer = async (req, res) => {
  const { sellerLocation, productId } = req.body;
  try {
    const product = await Product.findOne({ _id: productId });
    let buyers = await User.find({
      role: "buyer",
      _id: { $nin: product.rejectedByBuyerId }, // Find buyers whose _id is NOT IN rejectedByBuyerId array
    });
    const buyersWithDistance = buyers.map((buyer) => ({
      _id: buyer._id,
      distance: calculateDistance(
        sellerLocation.latitude,
        sellerLocation.longitude,
        buyer.location.latitude,
        buyer.location.longitude
      ),
    }));

    buyersWithDistance.sort((a, b) => a.distance - b.distance);
    const nearestBuyer = buyersWithDistance[0];
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { buyer: nearestBuyer } },
      { new: true }
    )
      .populate({
        path: "seller",
        select: "phoneNo _id username locationTxt",
      })
      .populate({
        path: "buyer",
        select: "_id phoneNo username locationTxt",
      });
    res.status(200).send({
      success: true,
      message: "New buyer assigned successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Oops! something went wrong" });
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
    res.status({ success: false, message: err.message });
  }
};

export const buyProduct = async (req, res) => {
  const { productId, sellerId, finalPrice } = req.query;
  let coinValue = 0;

  const session = await startSession();
  session.startTransaction();

  try {
    await Product.updateOne(
      { _id: productId },
      { $set: { status: "completed", finalPrice: finalPrice } },
      { session }
    );

    coinValue = finalPrice * 0.05;

    await User.updateOne(
      { _id: sellerId },
      { $inc: { coins: coinValue } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).send({ success: true, message: "Transaction successfull" });
  } catch (err) {
    await session.abortTransaction();
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
    res.status(500).send({ success: false, message: err.message });
  }
};
