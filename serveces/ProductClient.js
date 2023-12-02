import ProductModel from '../models/mongoose/ProductModel'
import ServiceClient from './ServiceClient'

class ProductClient {
  static async getProducts (page, itemsPerPage, keyword) {
    const result = await ServiceClient.callService('catalog-service', {
      method: 'get',
      url: '/product',
      params: {
        page, itemsPerPage, keyword
      }
    })
    return result
  }

  static async getProduct (id) {
    const result = await ServiceClient.callService('catalog-service', {
      method: 'get',
      url: `/product/get/${id}`
    })
    return result
  }

  static async addProduct (
    sku,
    name,
    price,
    count,
    isVisible,
    discountPercentage
  ) {
    const result = await ServiceClient.callService('catalog-service', {
      method: 'post',
      url: '/product/add',
      data: {
        sku,
        name,
        price,
        count,
        isVisible,
        discountPercentage
      }
    })
    return result
  }

  static async editProduct (
    id,
    sku,
    name,
    price,
    count,
    isVisible,
    discountPercentage
  ) {
    const result = await ServiceClient.callService('catalog-service', {
      method: 'put',
      url: `/product/edit/${id}`,
      data: {
        sku,
        name,
        price,
        count,
        isVisible,
        discountPercentage
      }
    })
    return result
  }

  static async deleteProduct (id) {
    const result = await ServiceClient.callService('catalog-service', {
      method: 'delete',
      url: `/product/delete/${id}`
    })
    return result
  }

  static async totalDiscount () {
    return await ProductModel.calculateTotalDiscountSum()
  }
}

export default ProductClient
