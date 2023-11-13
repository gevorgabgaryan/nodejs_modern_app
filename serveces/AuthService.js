import UserService from "./UserService";
import jwt from "jsonwebtoken";
import Config from "../config/";
import MailSenderService from "./MailSenderService";
import UserModel from "../models/userModel";
import ResetTokenModel from "../models/ResetTokenModel";
import SessionModel from "../models/SessionModel";

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
      id: newUser.id,
      isEmailSend,
      message: "Account was created",
    };
  }

  static async login(email, password, rememberMe) {
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
    if (!user.password) {
      return {
        message: "Social  user",
      };
    }
    const isMatched = user.comparePassword(password);

    if (!isMatched) {
      return {
        message: "invalid credentials",
      };
    }
    return AuthService._afterLogin(user, rememberMe);
  }

  static async socialLogin(oauthProfile) {
    let user = await UserService.findByOAuthProfile(
      oauthProfile.provider,
      oauthProfile.profileId
    );
    if (!user) {
      user = await UserService.findByEmail(oauthProfile.email);
    }

    if (!user) {
      if (!oauthProfile.emails || !oauthProfile.emails.length) {
        return {
          message: "Email required",
        };
      }
      const email = oauthProfile.emails[0].value;
      user = await UserService.addSocialUser(email, oauthProfile);
    }

    return AuthService._afterLogin(user);
  }

  static async _afterLogin(user, rememberMe) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      Config.JWTSecret,
      {
        expiresIn: rememberMe ? "1y" : "1h",
      }
    );

    const session = new SessionModel({
      token,
      userId: user.id,
      role: user.role,
    });

    await session.save();

    return {userId: user.id, email: user.email, token};
  }

  static async verify(userId, verificationToken) {
    const user = await UserService.findById(userId);
    if (!user) {x
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
    const resetToken = await AuthService._createPasswordResetToken(user.id);
    const isTokenlSend = await MailSenderService.sendMail(
      email,
      resetToken,
      "Reset password code"
    );
    return {
      id: user.id,
      message: isTokenlSend ? "Reset token sent" : "System error",
    };
  }

  static async verifyResetPassword(token, password) {
    console.log(password);
    const resetToken = await ResetTokenModel.findOne({token});
    if (!resetToken) {
      return {
        message: "Reset token not found",
      };
    }

    await UserService.resetPassword(resetToken.userId, password);

    await ResetTokenModel.deleteOne({token});

    return {
      message: "Password successful changed",
    };
  }

  static async logout(session) {
    const res = await SessionModel.deleteOne(session);
    return {
      message: "logout succesful",
    };
  }

  static async _createPasswordResetToken(userId) {
    const resetToken = new ResetTokenModel({userId});
    const newToken = await resetToken.save();
    return newToken.token;
  }

  static async checkToken(token, roles) {
   
    const session = await SessionModel.findOne({token});
    if (!session) {
      throw new Error("Invalid token");
    }
    const payload = jwt.verify(token, Config.JWTSecret);
    if (!session.userId.equals(payload.userId)) {
      throw new Error("Invalid token");
    }
    const user = await UserService.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (roles && !roles.includes(user.role)) {
      throw new Error("Access denied");
    }

    return session;
  }
}

export default AuthService;
