import { Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Category, SubCategory, Item, Review, User } = db;

function validateReview(body: any) {
  if (
    typeof body.reviewBody !== "string" ||
    body.reviewBody.length < 25 ||
    body.reviewBody.length > 250
  ) {
    return "Review must be between 25 and 250 characters";
  }
  if (typeof body.stars !== "number" || body.stars < 1 || body.stars > 5) {
    return "Stars must be between 1 and 5";
  }
  return null;
}
//get item by subcategory
router.get(
  "/category/:categoryId/:subCategoryId/items/:itemId",
  
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
         include: [
          {
            model: User,
            as: 'user',
            attributes: ['username'],
          }
         ],
         order: [['createdAt', 'DESC']],
         limit: 3,
        });
      const avgRating =
        reviews.length > 0
          ? (
              reviews.reduce((sum: number, review: { stars: number}) => sum + review.stars, 0) /
              reviews.length
            )
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
//get items by category
router.get('/category/:categoryId/items', validateUser, async (req: ValidUser, res: Response) => {
  const paramCategoryId = parseInt(req.params.categoryId, 10);
  try{
    const items = await Item.findAll({
      include: [
        { model: SubCategory,
          as: 'subCategory',
          where: {categoryId: paramCategoryId},
          attributes: ['id'],
          required: true
      }
    ],
    attributes: ['id', 'name', 'price', 'mainImageUrl', 'subCategoryId'],
    order: [['createdAt', 'DESC']]
    })
    if(!items.length){
      return res.json({items})
    }
    return res.json({ items})
  } catch(error){
    return res.status(500).json({ message: 'Internal Server Error'})
  }
})

//get item by itemId
router.get(
  "/items/:itemId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    const itemId = parseInt(req.params.itemId, 10);
    try {
      const item = await Item.findByPk(itemId, {
        include: [
          {
            model: SubCategory,
            as: "subCategory",
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
        where: { itemId: item.id },
        attributes: ["id", "stars", "reviewBody", "userId", "createdAt"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const avgRating =
        reviews.length > 0
          ? (
              reviews.reduce((sum: number, review: { stars: number }) => sum + review.stars, 0) /
              reviews.length
            )
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
        reviews,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//create a review for an item
router.post(
  "/items/:itemId/reviews",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { itemId } = req.params;
      const { reviewBody, stars } = req.body;

      const validationError = validateReview({ reviewBody, stars });
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      const existingReview = await Review.findOne({
        where: { userId: req.user.id, itemId },
      });
      if (existingReview) {
        return res.status(400).json({
          message: "You cannot leave more than one review for an item.",
        });
      }

      const newReview = await Review.create({
        userId: req.user.id,
        itemId,
        reviewBody,
        stars,
      });
      return res.json({ newReview });
    } catch (error) {
      return res.status(500).json({ message: "Unable to create review" });
    }
  }
);

//get reviews for an item
router.get(
  "/items/:itemId/reviews",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { itemId } = req.params;
      const reviews = await Review.findAll({
        where: { itemId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
        attributes: ["id", "stars", "reviewBody", "createdAt"],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ message: "Failed to load reviews" });
    }
  }
);

export = router
