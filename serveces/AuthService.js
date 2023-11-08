import UserService from "./UserService";

UserService;
class AuthService {
  static async registerService(email, password, firstName, lastName) {
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
    return {
      id: newUser._id,
      message: "Account was created",
    };
  }
}

export default AuthService;
