import { Router } from 'express'
import { uploadImage } from '../middlewares/uploadWithMulter'
import UserController from '../controllers/UserController'
import { resaizeImage } from '../middlewares/resizeWithJimp'

const userRoutes = Router()

userRoutes.post('/photo', uploadImage, resaizeImage, UserController.uploadPhoto)

export default userRoutes
