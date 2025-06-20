import { NextFunction, Response } from "express";
import { CustomeRequest } from "../../typings/express";
import { restoreUser } from "../../utils/auth";

import db from "../../db/models";

//imports from router files
// import splashRouter from './splash'
import userRouter from "./users";
import sessionRouter from "./session";
import homeRouter from "./home";
import categoryRouter from "./category";
import subCategoryItemRouter from './subcategoryItems'
import itemrouter from './items'
import reviewRouter from './review'
import cartRouter from './cart'
import listRouter from './list'
import orderRouter from './orders'
import checkoutRouter from './checkout'

import {
  ForbiddenError,
  NoResourceError,
  UnauthorizedError,
} from "../../errors/customErrors";
import csurf from "csurf";

const { User, SpotImage, ReviewImage, Review, Spot } = db;
const router = require("express").Router();
const { environment } = require("../../config");
const isProduction = environment === "production";

//route usage
router.use(restoreUser);
router.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "lax",
      httpOnly: true,
    },
  })
);
// router.use('./splash', splashRouter)
router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/home", homeRouter);
router.use("/category", categoryRouter);
router.use('/subCategoryItems', subCategoryItemRouter);
router.use('/', itemrouter);
router.use('/reviews', reviewRouter);
router.use('/list', listRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/checkout', checkoutRouter)

router.get("/restore-user", (req: any, res: Response) => {
  return res.json(req.user);
});

export = router;
