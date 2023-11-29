import ProductModel from '../models/mongoose/ProductModel'

class ProductService {
  static async getProducts (page, itemPerPage, keyword) {
    const query = {
      isVisible: true
    }

    const { default: escapeStringRegexp } = await import('escape-string-regexp')

    const sanitizedKeyword = escapeStringRegexp(keyword)

    if (sanitizedKeyword) {
      query.$or = [
        { name: { $regex: new RegExp(sanitizedKeyword, 'i') } },
        { sku: { $regex: new RegExp(sanitizedKeyword, 'i') } }
      ]
    }
    const products = await ProductModel.find(query)
      .skip((page - 1) * itemPerPage)
      .limit(itemPerPage)

    const totalProductsCount = await ProductModel.countDocuments(query)

    return {
      products,
      totalProductsCount
    }
  }

  static async getProduct (id) {
    return await ProductModel.findOne({ _id: id })
  }

  static async addProduct (
    sku,
    name,
    price,
    count,
    visible,
    discountPercentage
  ) {
    const skuExists = await ProductModel.exists({ sku })
    if (skuExists) {
      return {
        message: `The given sku ${sku} already exists`
      }
    }

    const product = new ProductModel({
      sku,
      name,
      price,
      count,
      discountPercentage,
      isVisible: visible
    })
    if (visible) {
      product.visible = visible
    }
    return await product.save()
  }

  static async editProduct (
    id,
    sku,
    name,
    price,
    count,
    visible,
    discountPercentage
  ) {
    const updateFields = {}

    if (sku) {
      updateFields.sku = sku
    }
    if (name) {
      updateFields.name = name
    }
    if (price) {
      updateFields.price = price
    }
    if (count) {
      updateFields.count = count
    }
    if (visible !== undefined) {
      updateFields.visible = visible
    }
    if (discountPercentage !== undefined) {
      updateFields.discountPercentage = discountPercentage
    }

    const { modifiedCount } = await ProductModel.updateOne(
      { _id: id },
      { $set: updateFields }
    )
    if (modifiedCount > 0) {
      return {
        message: 'Product updated successfully'
      }
    } else {
      return {
        message: 'No changes detected or product not found'
      }
    }
  }

  static async deleteProduct (id) {
    const { deletedCount } = await ProductModel.deleteOne({ _id: id })
    if (deletedCount > 0) {
      return {
        message: 'Product deleted successfully'
      }
    } else {
      return {
        message: 'Product not found'
      }
    }
  }

  static async totalDiscount () {
    return await ProductModel.calculateTotalDiscountSum()
  }
}

export default ProductService
