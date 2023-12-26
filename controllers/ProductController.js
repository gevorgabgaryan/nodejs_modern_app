import ProductService from '../serveces/ProductClient'
import logger from '../shared/logger'
import Config from '../config'

class ProductController {
  static async all (req, res) {
    const redisClient = Config.redis.client
    const { page, itemsPerPage, keyword } = req.query
    const cacheKey = `getProducts:${page}:${itemsPerPage}:${keyword}`
    try {
      const cacheResult = await redisClient.get(cacheKey)
      if (cacheResult) {
        return JSON.parse(cacheResult)
      }
      const result = await ProductService.getProducts(
        page,
        itemsPerPage,
        keyword
      )
      await redisClient.setex(cacheKey, 3600, JSON.stringify({
        status: true,
        result
      }))
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

  static async one (req, res) {
    const { id } = req.params
    try {
      const result = await ProductService.getProduct(id)
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

  static async add (req, res) {
    const { sku, name, price, count, isVisible, discountPercentage } = req.body
    try {
      const result = await ProductService.addProduct(
        sku,
        name,
        price,
        count,
        isVisible,
        discountPercentage
      )
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json(e)
    }
  }

  static async edit (req, res) {
    const { sku, name, price, count, visible, discountPercentage } = req.body
    const { id } = req.params
    try {
      const result = await ProductService.editProduct(
        id,
        sku,
        name,
        price,
        count,
        visible,
        discountPercentage
      )
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

  static async delete (req, res) {
    const { id } = req.params
    try {
      const result = await ProductService.deleteProduct(id)
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

  static async totalDiscount (req, res) {
    try {
      const result = await ProductService.totalDiscount()
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

export default ProductController
