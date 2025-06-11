import { Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Category, SubCategory, Item, Review } = db;

router.get(
  "/category/:categoryId/:subCategoryId/items/:itemId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { categoryId, subCategoryId, itemId } = req.params;

      const item = await Item.findOne({
        where: {
          id: itemId,
          subCategoryId,
        },
        include: [
          {
            model: SubCategory,
            as: "subCategory",
            where: { categoryId },
            include: [
              {
                model: Category,
                as: "category",
              },
            ],
          },
        ],
      });
      if (!item) {
        return res.status(404).json({ message: "Item not Found" });
      }
       const reviews = await Review.findAll({
        where: {itemId: item.id},
         attributes: ["id", "stars", "reviewBody", "userId", "createdAt"],
         order: ['createdAt', 'DESC'],
         limit: 3,
        });
      const avgRating =
        reviews.length > 0
          ? (
              reviews.reduce((sum: number, review: { stars: number}) => sum + review.stars, 0) /
              reviews.length
            ).toFixed(2)
          : null;

           return res.json({
            id: item.id,
            name: item.name,
            mainImageUrl: item.mainImageUrl,
            image2Url: item.image2Url,
            image3Url: item.image3Url,
            image4Url: item.image4Url,
            image5Url: item.image5Url,
            price: item.price,
            description: item.description,
            stars: avgRating,
            category: item.subCategory.category.name,
            subCategory: item.subCategory.name,
            reviews
    });
 } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export = router
