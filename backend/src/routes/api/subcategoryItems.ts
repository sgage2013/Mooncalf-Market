import { Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { SubCategory, Item, Review } = db;

router.get(
  "/category/:categoryId/:subCategoryId/items",
  validateUser,
  async (req: ValidUser, res: Response) => {
    const { categoryId, subCategoryId } = req.params;
    try {
      const subCategory = await SubCategory.findOne({
        where: {
          id: subCategoryId,
          categoryId: categoryId,
        },
      });
      if (!subCategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      const items = await Item.findAll({
        where: { subCategoryId },
        include: [
          {
            model: Review,
            as: "reviews",
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [
              db.sequelize.fn("AVG", db.sequelize.col("reviews.stars")),
              "avgRating",
            ],
            [
              db.sequelize.fn("COUNT", db.sequelize.col("reviews.id")),
              "reviewCount",
            ],
          ],
        },
        group: ["Item.id"],
      });
      return res.json({ items });
    } catch (error) {
      return res.status(500).json({ message: "Unable to fetch items" });
    }
  }
);

export = router;
