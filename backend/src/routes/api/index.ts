import { NextFunction, Response } from "express";
import { CustomeRequest } from "../../typings/express";
import { restoreUser } from "../../utils/auth";

import db from "../../db/models";

//imports from router files
import splashRouter from './splash'
import userRouter from "./users";
import sessionRouter from "./session";
import homeRouter from "./home";
import categoryRouter from "./category";
import subCategoryItemRouter from './subcategoryItems'
import singleItemrouter from './SingleItem'
import reviewRouter from './review'

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
router.use('./splash', splashRouter)
router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/home", homeRouter);
router.use("/category", categoryRouter);
router.use('/subCategoryItem', subCategoryItemRouter);
router.use('./singleItem', singleItemrouter)
router.use('./review', reviewRouter)

router.get("/restore-user", (req: any, res: Response) => {
  return res.json(req.user);
});

export = router;
