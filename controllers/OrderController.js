import OrderClient from "../serveces/OrderClient"
import logger from "../shared/logger"

class OrderController {
  static async add(req, res) {
    try {
      const result = await OrderClient.add(req.userId)
      res.json({
        status: true,
        result,
      })
    } catch (e) {
      console.log(e)
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: "System error",
      })
    }
  }
}

export default OrderController
