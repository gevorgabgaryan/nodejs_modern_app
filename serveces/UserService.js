import UserModel from "../models/userModel";

class UserService {
  static async findByEmail(email) {
    return await UserModel.findOne({email});
  }

  static async findByEmail(email) {
    return (await UserModel.findOne({email}));
  }
  static async findById(id) {
    return (await UserModel.findById(id));
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
      status: 'active'
    });
    return await user.save();
  }

  static async findByOAuthProfile(provider, profileId) {
    return (await UserModel.findOne({
      oauthprofiles: {$elemMatch: {provider, profileId}}
    }));
  }

  static async resetPassword(userId, password) {
    const user = await UserService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.password = password;
    return user.save();
  }
}

export default UserService;
