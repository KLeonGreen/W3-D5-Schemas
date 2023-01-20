import express from "express";
import q2m from "query-to-mongo";
import reviewModel from "./model.js";
import productModel from "../product/model.js";

const reviewRouter = express.Router();

// reviewRouter.post("/", async (request, response, next) => {
//   try {
//     const newReview = new reviewModel(request.body);
//     await newReview.save();
//     response.status(200).send(newReview);
//   } catch (error) {
//     next(error);
//   }
// });

reviewRouter.post("/:producId", async (request, response, next) => {
  try {
    const theProduct = await productModel.findById(request.params.producId);
    const newReview = new reviewModel(request.body);
    await newReview.save();
    const reviewID = newReview._id;

    const updateProduct = await productModel.findByIdAndUpdate(request.params.producId, { $push: { reviews: reviewID.toString() } }, { new: true });

    console.log("ID:", reviewID);

    console.log("theProduct:", updateProduct);
    await updateProduct.save();
    response.status(200).send(newReview);
  } catch (error) {
    next(error);
  }
});

reviewRouter.get("/", async (request, response, next) => {
  try {
    const mongoQuerry = q2m(request.query);

    const reviews = await reviewModel.find(mongoQuerry.criteria, mongoQuerry.options.fields, { _id: 0 }).limit(mongoQuerry.options.limit).skip(mongoQuerry.options.skip).sort(mongoQuerry.options.sort);
    response.status(200).send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewRouter.get("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const review = await reviewModel.findById(id);
    response.status(200).send(review);
  } catch (error) {
    next(error);
  }
});

reviewRouter.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const editedreview = await reviewModel.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });
    response.status(200).send(editedreview);
  } catch (error) {
    next(error);
  }
});

reviewRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const review = await reviewModel.findByIdAndDelete(id);
    response.status(200).send("Deleted");
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
