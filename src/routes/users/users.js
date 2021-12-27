import express from "express";
import createError from "http-errors";
import userSchema from "../../db/modals/user/user.js";
import { JWTauth } from "../../auth/jwt/tools.js";
import { JWTAuthMiddleware } from "../../auth/jwt/auth.js";
import passport from "passport";

const { Router } = express;

const router = Router();

router.route("/login").post(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.checkCredentials(email, password);

    if (user) {
      const tokens = await JWTauth(user);

      res.status(200).send({ success: true, data: tokens });
    } else {
      next(createError(401, "Invalid credentials"));
    }
  } catch (error) {
    next(error);
  }
});

router.route("/register").post(async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);

    if (newUser) {
      await newUser.save();

      const tokens = await JWTauth(user);

      res.status(200).send({ success: true, data: tokens });
    } else {
      next(createError(400, "Invalid credentials"));
    }
  } catch (error) {
    next(error);
  }
});

router
  .route("/me")
  .get(JWTAuthMiddleware, async (req, res,next) => {
    try {
      res.status(200).send({ success: true, data: req.user });
    } catch (error) {
        next(error);
    }
  })
  .put(JWTAuthMiddleware, async (req, res, next) => {
    try {
      

      res.status(203).send({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  })
  .delete(JWTAuthMiddleware, async (req, res, next) => {
    try {
      await req.user.deleteOne();

      res.status(204).send({ success: true, message: "User Deleted" });
    } catch (error) {
        next(error);
    }
  });

router.route("/logout").post(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

router.route("/refreshToken").post(async (req, res, next) => {
  try {
    const { currentRefreshToken } = req.body;

    const { accessToken, refreshToken } = await verifyRefreshToken(
      currentRefreshToken
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
    });
  } catch (error) {
    next(error);
  }
});

router
  .route("/googleLogin")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/googleRedirect")
  .get(passport.authenticate("google"), async (req, res, next) => {
    try {
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
      });

      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
      });

      res.redirect(`${process.env.FE_URL}`);
    } catch (error) {
      next(error);
    }
  });

export default router;