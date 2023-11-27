import { Router } from 'express'
import authRoutes from './authRoutes'
import productRoutes from './productRoutes'
import basketRoutes from './basketRoutes'
import orderRoutes from './orderRoutes'
import userRoutes from './userRoutes'
import { checkAuthorization } from '../middlewares/checkAuthorization'

const apiRoutes = Router()

apiRoutes.use('/auth', authRoutes)
apiRoutes.use('/products', productRoutes)
apiRoutes.use('/baskets', basketRoutes)
apiRoutes.use('/orders', orderRoutes)
apiRoutes.use('/users', checkAuthorization(), userRoutes)

export default apiRoutes
