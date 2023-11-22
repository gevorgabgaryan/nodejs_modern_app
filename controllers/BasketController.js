import BasketService from "../serveces/BasketService";
import Config from "../config";

class BasketController {
  static async add(req, res) {
    try {
      const {id} = req.params;
      const basket = new BasketService(Config.redis.client, req.userId);
      await basket.add(id);
      const itemCount = await basket.getItemCount(id);
      res.json({
        status: true,
        result: itemCount,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
}

export default BasketController;
