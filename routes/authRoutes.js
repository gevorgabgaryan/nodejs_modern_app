import {Router} from "express";
import AuthController from "../controllers/authController";
import githubOAuthRoutes from "./githubOAuthRoutes";
import {
  validateRegisterData,
  validateLoginData,
  validateVerifyData,
  validateResetPasswordData,
  validateVerifyResetPassword,
} from "../middlewares/validation";
import {passportCheckAuthorization} from "../middlewares/passportCheckAuthorization";

const authRoutes = Router();

authRoutes.post("/register", validateRegisterData, AuthController.register);

authRoutes.post("/login", validateLoginData, AuthController.login);

authRoutes.put(
  "/verify/:userId/:verificationToken",
  validateVerifyData,
  AuthController.verify
);

authRoutes.post(
  "/reset-password",
  validateResetPasswordData,
  AuthController.resetPassword
);

authRoutes.put(
  "/verify-reset-password/:resetToken",
  AuthController.verifyResetPassword
);

authRoutes.get(
  "/logout",
  passportCheckAuthorization(["admin", "editor", "user"]),
  AuthController.logout
);

authRoutes.use("/github", githubOAuthRoutes);

export default authRoutes;
