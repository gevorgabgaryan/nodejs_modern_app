import UserService from "./UserService";
import jwt from "jsonwebtoken";
import Config from "../config/";
import MailSenderService from "./MailSenderService";
import UserModel from "../models/userModel";

UserService;
class AuthService {
  static async register(email, password, firstName, lastName) {
    const existingEmail = await UserService.findByEmail(email);
    if (existingEmail) {
      return {
        message: "The given email already exists",
      };
    }

    const newUser = await UserService.addUser(
      email,
      password,
      firstName,
      lastName
    );
    const isEmailSend = await MailSenderService.sendMail(
      email,
      newUser.verificationToken
    );
    return {
      id: newUser._id,
      isEmailSend,
      message: "Account was created",
    };
  }

  static async login(email, password) {
    const user = await UserService.findByEmail(email);
    if (!user) {
      return {
        message: "invalid credentials",
      };
    }

    if (user.status === "new") {
      return {
        message: "verify email",
      };
    }

    if (user.status === "inctive") {
      return {
        message: "user not found ",
      };
    }

    const isMatched = user.comparePassword(password);

    if (!isMatched) {
      return {
        message: "invalid credentials",
      };
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      Config.JWTSecret,
      {
        expiresIn: "2d",
      }
    );

    return {jwt: token};
  }

  static async verify(userId, verificationToken) {
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        message: "User not found",
      };
    }

    if (user.verificationToken !== verificationToken) {
      return {
        message: "Invalid verification token",
      };
    }

    user.status = "active";
    await user.save();
    return {
      message: "Successful verification",
    };
  }
}

export default AuthService;
