import {Router} from "express";
import AuthController from "../controllers/authController";
import {validateRegisterData} from "../middlewares/validation";

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
    console.log(e)
    res.json({
      status: false,
      error: true,
      message: "System error",
    });
  }
});

export default authRoutes;
