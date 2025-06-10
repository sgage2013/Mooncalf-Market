import { NextFunction, Request, Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Item, Review } = db;

router.get("/home", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const newArrivals = await Item.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const highestRated = await Item.findAll({
      attributes: {
        include: [
          [
            db.sequelize.fn("AVG", db.sequelize.col("reviews.stars")),
            "avgRating",
          ],
        ],
      },
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: [],
        },
      ],
      group: ["Item.id"],
      order: [[db.sequelize.literal("avgRating"), "DESC"]],
      limit: 10,
    });
    return res.json({
      newArrivals,
      highestRated,
    });
  } catch (error) {
    return res.status(500).json("Failed to load home content");
  }
});

export = router;
