import express from "express";
import q2m from "query-to-mongo";
import productModel from "./model.js";

const productRouter = express.Router();

productRouter.post("/", async (request, response, next) => {
  try {
    const newProduct = new productModel(request.body);
    await newProduct.save();
    response.status(200).send(newProduct);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (request, response, next) => {
  try {
    const mongoQuerry = q2m(request.query);

    const products = await productModel.find(mongoQuerry.criteria, mongoQuerry.options.fields).limit(mongoQuerry.options.limit).skip(mongoQuerry.options.skip).sort(mongoQuerry.options.sort);
    response.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

export default productRouter;
