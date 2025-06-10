import { Response } from "express";
import { check } from "express-validator";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import { handleValidationErrors } from "../../utils/validation";
import db from "../../db/models";
const router = require("express").Router();

const { Item, Review, List } = db;

const validList = [
  check("name").notEmpty().withMessage("List name is required"),
  check("description")
    .optional()
    .isLength({ max: 250 })
    .withMessage("Description must be less than 250 characters"),
  handleValidationErrors,
];

//get all lists
router.get("/lists", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const lists = await List.findAll({
      where: { userId: req.user.id },
    });
    return res.json({ lists });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load lists" });
  }
});

//get one list
router.get(
  "/lists/:listId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const listId = req.params.listId;
      const list = await List.findOne({
        where: {
          id: listId,
          userId: req.user.id,
        },
        include: [
          {
            model: Item,
            through: { attributes: [] },
            attributes: [
              "id",
              "name",
              "price",
              [
                db.sequelize.fn(
                  "AVG",
                  db.sequelize.col("items.reviews.rating")
                ),
                "avgRating",
              ],
            ],
            include: [
              {
                model: Review,
                attributes: [],
              },
            ],
          },
        ],
        group: ["List.id", "items.id"],
      });
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }
      return res.json(list);
    } catch (error) {
      return res.status(500).json({ message: "Unable to load list" });
    }
  }
);

//create a list
router.post(
  "/lists",
  validateUser,
  validList,
  async (req: ValidUser, res: Response) => {
    try {
      const { name, description } = req.body;
      const list = await List.create({
        name,
        description,
        userId: req.user.id,
      });
      return res.json(list);
    } catch (error) {
      return res.status(500).json({ message: "Could not create list" });
    }
  }
);

//update a list
router.put(
  "/lists/:listId",
  validList,
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { name, description } = req.body;
      const list = await List.create({
        name,
        description,
        userId: req.user.id,
      });
      return res.json(list);
    } catch (error) {
      return res.status(500).json({ message: "Unable to update list" });
    }
  }
);

//delete a list
router.delete(
  "/lists/:listId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { listId } = req.params;
      const list = await List.findOne({
        where: { id: listId, userId: req.user.id },
      });
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }
      await list.destroy();
      return res.status(200).json({ message: 'List deleted successfully'})
    } catch (error) {
      return res.status(500).json({ message: "Unable to delete list" });
    }
  }
);

export = router;
