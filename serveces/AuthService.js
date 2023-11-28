import UserService from './UserService'
import jwt from 'jsonwebtoken'
import Config from '../config/'
import MailSenderService from './MailSenderService'
import ResetTokenModel from '../models/mongoose/ResetTokenModel'
import logger from '../shared/logger'

class AuthService {
  static async register (email, password, firstName, lastName) {
    const existingEmail = await UserService.findByEmail(email)
    if (existingEmail) {
      return {
        message: 'The given email already exists'
      }
    }

    const newUser = await UserService.addUser(
      email,
      password,
      firstName,
      lastName
    )

    let isEmailSend = false
    if (process.env.NODE_ENV !== 'production') {
      isEmailSend = await MailSenderService.sendMail(
        email,
        newUser.verificationToken,
        'Verification Code'
      )
    }

    return {
      id: newUser.id,
      isEmailSend,
      message: 'Account was created'
    }
  }

  static async login (email, password, rememberMe) {
    const user = await UserService.findByEmail(email)
    if (!user) {
      return {
        message: 'invalid credentials'
      }
    }

    if (user.status === 'new') {
      return {
        message: 'verify email'
      }
    }

    if (user.status === 'inctive') {
      return {
        message: 'user not found '
      }
    }
    if (!user.password) {
      return {
        message: 'Social user'
      }
    }
    const isMatched = user.comparePassword(password)

    if (!isMatched) {
      return {
        message: 'invalid credentials'
      }
    }
    return AuthService._afterLogin(user, rememberMe)
  }

  static async socialLogin (oauthProfile) {
    let user = await UserService.findByOAuthProfile(
      oauthProfile.provider,
      oauthProfile.profileId
    )
    if (!user) {
      user = await UserService.findByEmail(oauthProfile.email)
    }

    if (!user) {
      if (!oauthProfile.emails || !oauthProfile.emails.length) {
        return {
          message: 'Email required'
        }
      }
      const email = oauthProfile.emails[0].value
      user = await UserService.addSocialUser(email, oauthProfile)
    }

    return AuthService._afterLogin(user)
  }

  static async _afterLogin (user, rememberMe) {
    const redisClient = Config.redis.client
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      Config.JWTSecret,
      {
        expiresIn: rememberMe ? '1y' : '3h'
      }
    )

    await redisClient.sadd(`user:${user.id}:tokens`, token)
    return { userId: user.id, email: user.email, token }
  }

  static async verify (userId, verificationToken) {
    const user = await UserService.findById(userId)
    if (!user) {
      return {
        message: 'User not found'
      }
    }

    if (user.verificationToken !== verificationToken) {
      return {
        message: 'Invalid verification token'
      }
    }

    user.status = 'active'
    await user.save()
    return {
      message: 'Successful verification'
    }
  }

  static async resetPassword (email) {
    const user = await UserService.findByEmail(email)
    if (!user) {
      return {
        message: 'User not found'
      }
    }
    const resetToken = await AuthService._createPasswordResetToken(user.id)
    const isTokenlSend = await MailSenderService.sendMail(
      email,
      resetToken,
      'Reset password code'
    )
    return {
      id: user.id,
      message: isTokenlSend ? 'Reset token sent' : 'System error'
    }
  }

  static async verifyResetPassword (token, password) {
    logger.info(password)
    const resetToken = await ResetTokenModel.findOne({ token })
    if (!resetToken) {
      return {
        message: 'Reset token not found'
      }
    }

    await UserService.resetPassword(resetToken.userId, password)

    await ResetTokenModel.deleteOne({ token })

    return {
      message: 'Password successful changed'
    }
  }

  static async logout (userId, token) {
    const redisClient = Config.redis.client
    await redisClient.srem(`user:${userId}:tokens`, token)
    return {
      message: 'logout succesful'
    }
  }

  static async _createPasswordResetToken (userId) {
    const resetToken = new ResetTokenModel({ userId })
    const newToken = await resetToken.save()
    return newToken.token
  }

  static async checkToken (token, authorizationRoles) {
    try {
      const payload = jwt.verify(token, Config.JWTSecret)
      const { userId, role } = payload
      const redisClient = Config.redis.client
      const exists = await redisClient.sismember(
        `user:${userId}:tokens`,
        token
      )

      if (exists !== 1) {
        throw new Error('Invalid token')
      }

      if (authorizationRoles && !authorizationRoles.includes(role)) {
        throw new Error('Access denied')
      }
      return { userId, role }
    } catch (e) {
      logger.error(e)
      throw new Error(JSON.stringify(e))
    }
  }
}

export default AuthService
