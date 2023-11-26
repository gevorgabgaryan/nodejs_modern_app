import UserModel from "../models/mongoose/UserModel";
import util from "util";
import Config from "../config";
import {unlink, existsSync} from "fs";
const fsunlink = util.promisify(unlink);

class UserService {
  static async findByEmail(email) {
    return await UserModel.findOne({email});
  }

  static async findByEmail(email) {
    return await UserModel.findOne({email});
  }
  static async findById(id) {
    return await UserModel.findById(id);
  }

  static async addUser(email, password, firstName, lastName) {
    const user = new UserModel({
      email,
      password,
      firstName,
      lastName,
    });
    return await user.save();
  }

  static async addSocialUser(email, oauthProfile) {
    const user = new UserModel({
      email: email,
      oauthprofiles: [oauthProfile],
      status: "active",
    });
    return await user.save();
  }

  static async findByOAuthProfile(provider, profileId) {
    return await UserModel.findOne({
      oauthprofiles: {$elemMatch: {provider, profileId}},
    });
  }

  static async resetPassword(userId, password) {
    const user = await UserService.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.password = password;
    return user.save();
  }
  static async makeOnline(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.isOnline = true;
    user.updatedAt = new Date();
    return await user.save();
  }
  static async makeOffline(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.isOnline = false;
    user.updatedAt = new Date();
    return await user.save();
  }

  static async uploadPhoto(userId, fileName) {
    const user = await UserService.findById(userId);
    if (!user) {
      return {
        message: "User not found",
      };
    }
    if (user.imagePath && user.imagePath !== fileName) {
      const imagePath = `${Config.userPhotosDir}/${user.imagePath}`;
      const imageAvatarPath = `${Config.userPhotosDir}/avatar_${user.imagePath}`;
      if (existsSync(imagePath)) {
        await fsunlink(imagePath);
      }
      if (existsSync(imageAvatarPath)) {
        await fsunlink(imageAvatarPath);
      }
    }
    user.imagePath = fileName;
    await user.save();
    return fileName;
  }
}

export default UserService;
