import { NextFunction, Request, Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Item, Review, Category, SubCategory } = db;

router.get("/", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
        include: [{
          model: SubCategory,
          as: 'subcategories',
          attributes: ['id', 'name'],
        }],
    })
    const newArrivals = await Item.findAll({
        attributes: [
        'id',
        'name',
        'mainImageUrl',
        'price',
        'categoryId',
        'subCategoryId',
         [db.sequelize.fn("AVG", db.sequelize.col("reviews.stars")),
            "avgRating"],
    ],
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: [],
          required: false,
        },
      ],
      group: ["Item.id"],
      order: [["createdAt", "DESC"]],
      limit: 10,
      subQuery: false,
    });

    const highestRated = await Item.findAll({
      attributes: [
        'id',
        'name',
        'mainImageUrl',
        'price',
        'categoryId',
        'subCategoryId',
         [db.sequelize.fn("AVG", db.sequelize.col("reviews.stars")),
            "avgRating"],
    ],
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: [],
          required: false,
        },
      ],
      group: ["Item.id"],
      order: [[db.sequelize.literal("avgRating"), "DESC"]],
      limit: 10,
      subQuery: false,
    });


    return res.json({
      categories,
      newArrivals,
      highestRated,
    });
  } catch (error: any) {
    console.log(error)
    return res.status(500).json("Failed to load home content");


  }
});

export = router;
