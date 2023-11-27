import {Router} from "express";
import AuthController from "../controllers/authController";
import passport from "passport";
const githubOAuthRoutes = Router();

githubOAuthRoutes.get("/", passport.authenticate("github"));

githubOAuthRoutes.get(
  "/callback",
  passport.authenticate("github", {scope: ["user:email"], session: false}),
  async (req, res) => {
    try {
      const result = await AuthController.socialLogin(req.oauthProfile, {
        failureRedirect: "/api/auth/github/failure",
      });
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      logger.error(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
);

githubOAuthRoutes.get(
  "/failure",
  passport.authenticate("github", {scope: ["user:email"]}),
  async (req, res) => {
    try {
      return res.status(401).json({
        message: "unauthorized",
      });
    } catch (e) {
      logger.error(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
);

export default githubOAuthRoutes;
