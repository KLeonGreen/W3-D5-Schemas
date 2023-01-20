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
    console.log("mongoQuerry:", mongoQuerry);
    const total = await productModel.countDocuments(mongoQuerry.criteria);
    const links = mongoQuerry.links("http://localhost:3000/products", total);
    console.log("links:", links);

    const products = await productModel
      .find(mongoQuerry.criteria, mongoQuerry.options.fields)
      .limit(mongoQuerry.options.limit)
      .skip(mongoQuerry.options.skip)
      .sort(mongoQuerry.options.sort)
      .populate({ path: "reviews", select: "comment rate" });

    response.status(200).send({ total, links, products });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const product = await productModel.findById(id).populate({ path: "reviews", select: "comment rate" });
    response.status(200).send(product);
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const editedProduct = await productModel.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });
    response.status(200).send(editedProduct);
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const product = await productModel.findByIdAndDelete(id);
    response.status(200).send("Deleted");
  } catch (error) {
    next(error);
  }
});

export default productRouter;
