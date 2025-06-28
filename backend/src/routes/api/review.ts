import { Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { User, Review } = db;

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



router.put(
  "/:reviewId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { reviewId } = req.params;
      const { reviewBody, stars } = req.body;
      const userId = req.user.id;

       const reviewIdNum = parseInt(reviewId, 10);
      if (isNaN(reviewIdNum)) {
          return res.status(400).json({ message: "Invalid review ID" });
      }

      const validationError = validateReview({ reviewBody, stars });
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      const review = await Review.findByPk(reviewId, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username", "id"],
          }
        ],
        attributes: ["id", "userId", "itemId", "reviewBody", "stars", "createdAt"],
      })
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      if (review.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      review.reviewBody = reviewBody;
      review.stars = stars;

      await review.save();

      return res.json(review);
    } catch(error) {
      return res.status(500).json({ message: "Failed to update review" });
    }
  }
);

router.delete(
  "/:reviewId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { reviewId } = req.params;
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      if (review.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      await review.destroy();
      return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete review" });
    }
  }
);

export = router;
