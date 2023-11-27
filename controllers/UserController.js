import UserService from '../serveces/UserService'
import logger from '../shared/logger'

class UserController {
  static async uploadPhoto (req, res) {
    try {
      const fileName = `${req.dateFolder}/${req.fileName}`
      const result = await UserService.uploadPhoto(req.userId, fileName)
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

export default UserController
