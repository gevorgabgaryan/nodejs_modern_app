import UserService from "./UserService";
import jwt from "jsonwebtoken";
import Config from "../config/";
import MailSenderService from "./MailSenderService";
import UserModel from "../models/userModel";
import ResetTokenModel from "../models/ResetTokenMpdel";

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
      newUser.verificationToken,
      "Verification Code"
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

  static async resetPassword(email) {
    const user = await UserService.findByEmail(email);
    if (!user) {
      return {
        message: "User not found",
      };
    }
    const resetToken = await this._createPasswordResetToken(user._id);
    const isTokenlSend = await MailSenderService.sendMail(
      email,
      resetToken,
      "Reset password code"
    );
    return {
      id: user._id,
      message: isTokenlSend ? "Reset token sent" : "System error",
    };
  }

  static async verifyResetPassword(token, password) {
    console.log(password)
    const resetToken = await ResetTokenModel.findOne({token});
    if (!resetToken) {
      return {
        message: "Reset token not found",
      };
    }

    await UserService.resetPassword(resetToken.userId, password);

    await ResetTokenModel.deleteOne({token});

    return {
      message: 'Passwor successful changed'
    };
  }

  static async _createPasswordResetToken(userId) {
    const resetToken = new ResetTokenModel({userId});
    const newToken = await resetToken.save();
    return newToken.token;
  }
}

export default AuthService;
