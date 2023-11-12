import AuthService from "../serveces/authService";

class AuthController {
  static async register(email, password, firstName, lastName) {
    return await AuthService.register(email, password, firstName, lastName);
  }

  static async login(email, password, rememberMe) {
    return await AuthService.login(email, password, rememberMe);
  }

  static async socialLogin(oauthProfile) {
    return await AuthService.socialLogin(oauthProfile);
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

  static async logout(session) {
    return await AuthService.logout(session);
  }
}

export default AuthController;
