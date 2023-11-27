import { promisify } from 'util'
import Config from '../config'
const multer = require('multer')
const path = require('path')

export const uploadImage = async (req, res, next) => {
  const userId = req.userId
  const now = new Date()
  const dateFolder = `${now.getFullYear()}/${
    now.getMonth() + 1
  }/${now.getDate()}`
  req.dateFolder = dateFolder
  const storage = multer.diskStorage({
    destination: path.join(Config.userPhotosDir, dateFolder),
    filename: function (req, file, callback) {
      const fileName = userId + path.extname(file.originalname)
      req.fileName = fileName
      callback(null, fileName)
    }
  })

  // Filter files with multer
  const multerFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      // eslint-disable-next-line n/no-callback-literal
      cb('Error: Images only!')
    }
  }

  const uploadMiddleware = multer({
    storage,
    limit: 4 * 1024 * 1024, // 4 MB limit
    fileFilter: multerFilter
  })

  const upload = promisify(uploadMiddleware.single('file'))

  try {
    await upload(req, res)
    next()
  } catch (e) {
    console.log(e)
    if (e instanceof multer.MulterError) {
      res.json({
        message: e.message
      })
    } else {
      res.json({
        message: 'unexpected error'
      })
    }
  }
}
