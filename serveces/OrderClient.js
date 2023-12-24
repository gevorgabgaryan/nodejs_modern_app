import Config from "../config"
import UserService from "./UserService"
import BasketService from "./BasketService"
import ProductService from "./ProductClient"
import * as amqp from "amqplib"


class OrderClient {
  static async add(userId) {
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
          name: product.name,
        }
      }),
    )

    if (!products.length) {
      throw new CustomError(`Products not found`, 'ADD_ORDER', HttpStatusCode.BAD_REQUEST)
    }

    const connection = await amqp.connect("amqp://127.0.0.1")
    const channel = await connection.createChannel()
    const queue = "orders"
    const message = JSON.stringify({
      userId: userId,
      email: user.email,
      products,
    })
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(message))
    console.log("Sent %s", message)
  }
}

export default OrderClient
