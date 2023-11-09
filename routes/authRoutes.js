import {Router} from "express";
import AuthController from "../controllers/authController";
import {
  validateRegisterData,
  validateLoginData,
  validateVerifyData,
  validateResetPasswordData,
  validateVerifyResetPassword,
} from "../middlewares/validation";

const authRoutes = Router();

authRoutes.post("/register", validateRegisterData, async (req, res) => {
  const {email, password, firstName, lastName} = req.body;
  try {
    const result = await AuthController.register(
      email,
      password,
      firstName,
      lastName
    );
    res.json({
      status: true,
      result,
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      error: true,
      message: "System error",
    });
  }
});

authRoutes.post("/login", validateLoginData, async (req, res) => {
  try {
    const {email, password} = req.body;
    const result = await AuthController.login(email, password);
    res.json({
      status: true,
      result,
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      error: true,
      message: "System error",
    });
  }
});

authRoutes.put(
  "/verify/:userId/:verificationToken",
  validateVerifyData,
  async (req, res) => {
    try {
      const {userId, verificationToken} = req.params;
      const result = await AuthController.verify(userId, verificationToken);
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
);

authRoutes.post(
  "/reset-password",
  validateResetPasswordData,
  async (req, res) => {
    try {
      const {email} = req.body;
      const result = await AuthController.resetPassword(email);
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
);

authRoutes.put(
  "/verify-reset-password/:resetToken",
  validateVerifyResetPassword,
  async (req, res) => {
 
    try {
      const {resetToken} = req.params;
      const {password} = req.body;

      const result = await AuthController.verifyResetPassword(
        resetToken,
        password
      );
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
);

export default authRoutes;
