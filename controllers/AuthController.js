import AuthService from '../serveces/authService'
import logger from '../shared/logger'

class AuthController {
  static async register (req, res) {
    const { email, password, firstName, lastName } = req.body
    try {
      const result = await AuthService.register(
        email,
        password,
        firstName,
        lastName
      )
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async login (req, res) {
    try {
      const { email, password, rememberMe } = req.body
      const result = await AuthService.login(email, password, rememberMe)
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async socialLogin (oauthProfile) {
    return await AuthService.socialLogin(oauthProfile)
  }

  static async verify (req, res) {
    try {
      const { userId, verificationToken } = req.params
      const result = await AuthService.verify(userId, verificationToken)
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async resetPassword (req, res) {
    try {
      const { email } = req.body
      const result = await AuthService.resetPassword(email)
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async verifyResetPassword (req, res) {
    try {
      const { resetToken } = req.params
      const { password } = req.body
      const result = await AuthService.verifyResetPassword(
        resetToken,
        password
      )
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async logout (req, res) {
    try {
      const token = req.headers.Authorization
        ? req.headers.Authorization
        : req.headers.authorization
      const result = await AuthService.logout(req.userId, token.split(' ')[1])
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }
}

export default AuthController
