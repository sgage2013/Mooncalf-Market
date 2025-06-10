import { NextFunction, Request, Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { SubCategory, Category, Item } = db;

router.get("/category/:categoryId", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"],
      include: [{
        model: SubCategory,
        as: 'subcategories',
        attributes: ['id', 'name']

    }]
    });
    const newArrivals = await Item.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    return res.json({
      categories,
      newArrivals,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load Categories" });
  }
});

export = router;
