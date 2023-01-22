import express from "express";
import q2m from "query-to-mongo";
import userModel from "./userModel.js";
import productModel from "../product/model.js";
import cartModel from "./cartModel.js";

const userRouter = express.Router();

userRouter.post("/", async (request, response, next) => {
  try {
    const newUser = new userModel(request.body);
    await newUser.save();
    response.status(200).send(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/:id/cart", async (request, response, next) => {
  try {
    const { productId, quantity } = request.body;
    //console.log(bookId, quantity);

    const user = await userModel.findById(request.params.id);
    //console.log(user);

    const product = await productModel.findById(productId);
    //console.log(product);

    const isTheProductInTheCart = await cartModel.findOne({ user: request.params.id, status: "Active", "product.productId": productId });
    if (isTheProductInTheCart) {
      const updatedCart = await cartModel.findOneAndUpdate(
        {
          user: request.params.id,
          status: "Active",
          "product.productId": productId,
        },
        { $inc: { "product.$.quantity": quantity } },
        { new: true, runValidators: true }
      );

      response.send(updatedCart);
    } else {
      const cartUpdate = await cartModel.findOneAndUpdate(
        { user: request.params.id, status: "Active" },
        { $push: { product: { productId: productId, quantity } } },
        { new: true, runValidators: true, upsert: true }
      );

      response.send(cartUpdate);
    }
  } catch (error) {
    next(error);
  }
});
userRouter.get("/", async (request, response, next) => {
  try {
    const users = await userModel.find();

    response.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
