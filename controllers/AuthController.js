import AuthService from "../serveces/authService";

class AuthController {
  static async register(email, password, firstName, lastName) {
    return await AuthService.register(email, password, firstName, lastName);
  }

  static async login(email, password) {
    return await AuthService.login(email, password);
  }

  static async verify(userId, verificationToken) {
    return await AuthService.verify(userId, verificationToken);
  }

  static async resetPassword(email) {
    return await AuthService.resetPassword(email);
  }

  static async verifyResetPassword(resetToken, password) {
    return await AuthService.verifyResetPassword(resetToken, password);
  }
}

export default AuthController;
