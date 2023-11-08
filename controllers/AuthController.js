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

  static async login(email, password){
    return await AuthService.loginService(email, password);
  }
}

export default AuthController;
