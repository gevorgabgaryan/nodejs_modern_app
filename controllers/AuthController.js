import AuthService from "../serveces/authService";

class AuthController {
  static async register(email, password, firstName, lastName) {
    return await AuthService.registerService(
      email,
      password,
      firstName,
      lastName
    );
  }
}

export default AuthController;
