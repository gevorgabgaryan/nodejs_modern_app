import UserService from '../serveces/UserService'

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
      console.log(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }
}

export default UserController
