import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import fs from "fs-extra";
import { param } from "express-validator";
import productModel from "../product/model.js";

const imageRouter = express.Router();

const imageUploaderToCloudinary = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "products/images" },
  }),
}).single("image");

imageRouter.post("/:productId/images", imageUploaderToCloudinary, async (request, response, next) => {
  try {
    const theProduct = await productModel.findByIdAndUpdate(request.params.productId, { imageUrl: request.file.path }, { new: true });
    await theProduct.save();
    response.status(200).send(theProduct);
  } catch (error) {
    next(error);
  }
});

export default imageRouter;
