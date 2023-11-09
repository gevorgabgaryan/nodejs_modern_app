import UserModel from "../models/userModel";

class UserService {
  static async findByEmail(email) {
    return await UserModel.findOne({email});
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

  static async resetPassword(userId, password) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.password = password;
    return user.save();
  }
}

export default UserService;
