import { NextFunction, Request, Response } from "express";
import { AuthReq } from "../../typings/express";
import {
  setTokenCookie,
  requireAuth,
  restoreUser,
  validateUser,
} from "../../utils/auth";
import { handleValidationErrors } from "../../utils/validation";
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const { Op } = require("sequelize");

import db from "../../db/models";
import { errors } from "../../typings/errors";
import { NoResourceError } from "../../errors/customErrors";

const { User, UserImage } = db;

const router = require("express").Router();

const validateSignup = [
  check("email").isEmail().withMessage("Please provide a valid email."),
  check("username")
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post(
  "/signup",
  validateSignup,
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, username, isHost } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    let existingUser = await User.findOne({
      where: {
        [Op.or]: {
          username,
          email,
        },
      },
    });

    if (existingUser) {
      if (existingUser) existingUser = existingUser.toJSON();
      let errors: errors = {};

      if (existingUser.email === email) {
        errors["email"] = "User with that email already exists";
      }
      if (existingUser.username === username) {
        errors["username"] = "User with that username already exists";
      }
      res.status(500);
      return res.json({ message: "User already exists", errors });
    } else {
      try {
        const user = await User.create({
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          isHost: isHost || false,
        });

        const safeUser = await user.getSafeUser();

        await setTokenCookie(res, safeUser);

        return res.json({
          ...safeUser,
        });
      } catch (e) {
        return next(e);
      }
    }
  }
);

//get all users
router.get("/all", async (req: Request, res: Response) => {
  const users = await User.findAll({
    include: {
      model: UserImage,
    },
  });
  res.json(users);
});

router.delete(
  "/profile",
  validateUser,
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      if (userId !== String(userId)) {
        const user = await User.findByPk(userId);
        if (!user)
          throw new NoResourceError(
            "No user found with those credentials",
            404
          );
        user.destroy();
        res.status(202);
        res.json({ user: null });
      } else {
        throw new Error("You can not delete the Demo User account.");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/profile",
  validateUser,
  async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "username", "email", "firstName", "lastName"],
      });

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/profile",
  validateUser,
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { email, username, password } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (username && username !== user.username) {
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          return res.status(400).json({ message: "Username already taken" });
        }
        user.username = username;
      }
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
          return res.status(400).json({ message: "Email already taken" });
        }
        user.email = email;
      }
      if (password) {
        (user.hashedPassword = bcrypt.hashSync(password));
      }
      await user.save();

      const safeUser = await user.getSafeUser();

      return res.json({ user: safeUser });
    } catch (error) {
      next(error);
    }
  });

export = router;
