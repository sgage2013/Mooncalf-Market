import { NextFunction, Request, Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { SubCategory, Category, Item } = db;

router.get(
  "/category/:categoryId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    const { categoryId } = req.params;
    try {
      const category = await Category.findByPk(categoryId, {
        attributes: ["id", "name"],
        include: [
          {
            model: SubCategory,
            as: "subcategories",
            attributes: ["id", "name"],
          },
        ],
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const newArrivals = await Item.findAll({
        where: { categoryId },
        order: [["createdAt", "DESC"]],
        limit: 10,
      });
      return res.json({
        category,
        newArrivals,
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to load Categories" });
    }
  }
);

export = router;
