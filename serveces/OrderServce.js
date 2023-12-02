import Models from '../models/sequelize'
import Config from '../config'
import UserService from './UserService'
import BasketService from './BasketService'
import ProductService from './ProductClient'

class OrderService {
  constructor (sequelize) {
    Models(sequelize)
    this.client = sequelize
    this.models = sequelize.models
  }

  async add (userId) {
    const user = await UserService.findById(userId)
    const basket = new BasketService(Config.redis.client, userId)
    const basketProducts = await basket.getAll()

    const products = await Promise.all(
      Object.keys(basketProducts).map(async (key) => {
        const product = await ProductService.getProduct(key)
        return {
          sku: product.sku,
          qty: basketProducts[key],
          price: product.price,
          name: product.name
        }
      })
    )

    await this.inTransaction(async (t) => {
      await this.create(user, products, t)

      await Promise.all(
        Object.keys(basketProducts).map(async (productId) => {
          await basket.remove(productId)
        })
      )
    })
  }

  async inTransaction (work) {
    const t = await this.client.transaction()
    try {
      await work(t)
      return t.commit()
    } catch (error) {
      t.rollback()
      throw error
    }
  }

  async create (user, items, t) {
    const order = await this.models.Order.create(
      {
        userId: user.id,
        email: user.email,
        status: 'Not Shipped'
      },
      {
        transaction: t
      }
    )

    return Promise.all(
      items.map(async (item) => {
        const orderItem = await this.models.OrderItem.create({
          sku: item.sku,
          qty: item.qty,
          price: item.price,
          name: item.name
        })
        return order.addOrderItem(orderItem, { transaction: t })
      })
    )
  }

  async getAll () {
    return this.models.Order.findAll({
      where: {},
      include: [this.models.OrderItem]
    })
  }

  async setStatus (orderId, status) {
    return this.models.Order.update({ status }, { where: { id: orderId } })
  }
}

export default OrderService
