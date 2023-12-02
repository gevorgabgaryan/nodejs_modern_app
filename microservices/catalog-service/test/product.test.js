import request from 'supertest'
import MongooseService from '../databases/MongooseService'

import API from '../API/API'
import ProductService from '../serveces/ProductService'
let server

describe('test the product API', () => {
  beforeAll(async () => {
    await MongooseService.init()
    server = await API.init()
  })

  afterAll(async () => {
    await ProductService.deleteAll()
    await MongooseService.disconnect()
    if (server) {
      server.close()
    }
  })

  // Test adding a product
  it('should add a product', async () => {
    const product = {
      name: 'Product1',
      sku: 'sku1',
      price: 900,
      count: 100,
      isVisible: true,
      discountPercentage: 20
    }

    const res = await request(server).post('/product/add').send(product)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: true,
        result: expect.objectContaining({
          id: res.body.result.id, ...product
        })
      })
    )
  })

  // Test adding a product with a duplicate SKU
  it('should get an error for adding a product with duplicate SKU', async () => {
    const product = {
      name: 'Product1',
      sku: 'sku1',
      price: 900,
      count: 100,
      isVisible: true,
      discountPercentage: 20
    }
    const res = await request(server).post('/product/add').send(product)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        code: 400,
        error: true,
        key: 'ADD_PRODUCT',
        message: `The given sku ${product.sku} already exists`
      })
    )
  })

  // Test get  products
  it('should get products', async () => {
    const queryParams = {
      itemsPerPage: 10,
      page: 1
    }

    const res = await request(server).get('/product').query(queryParams)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: true,
        result: expect.objectContaining({
          products: res.body.result.products,
          totalProductsCount: res.body.result.totalProductsCount
        })
      })
    )
  })
})
