import { Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Category, SubCategory, Item, User, Review } = db;

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
      return res.status(200).json({ reviews });
    } catch (error) {
      return res.status(500).json({ message: "Failed to load reviews" });
    }
  }
);

router.post(
  "/items/:itemId/reviews",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { itemId } = req.params;
      const { reviewBody, stars } = req.params;

      const validationError = validateReview({ reviewBody, stars });
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      const existingReview = await Review.findOne({
        where: { userId: req.user.id, itemId },
      });
      if (existingReview) {
        return res
          .status(400)
          .json({
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

router.put(
  "/items/:itemId/reviews/:reviewId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { reviewId } = req.params;
      const { reviewBody, stars } = req.params;

      const validationError = validateReview({ reviewBody, stars });
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      if(review.userId !== req.user.id){
        return res.status(403).json({ message: "Unauthorized"})
      }

      review.reviewBody = reviewBody;
      review.stars = stars;
      
      await review.save

      return res.json({review})
    } catch {
      return res.status(500).json({ message: "Failed to update review" });
    }
  }
);

router.delete('/items/:itemId/reviews/:reviewId', validateUser, async (req: ValidUser, res: Response) => {
    try{
        const { reviewId } = req.params;
        const review = await Review.findByPk(reviewId)
        if(!review){
            return res.status(404).json({ message: 'Review not found'})
        };
        if(review.userId !== req.user.id){
            return res.status(403).json({ message: 'Unauthorized'})
        }
        await review.destroy
        return "Review deleted successfully"
    } catch(error){
        return res.status(500).json({ message: 'Failed to delete review'})
    }
});

export = router
