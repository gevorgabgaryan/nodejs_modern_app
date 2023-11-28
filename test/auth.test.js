import request from 'supertest'
import MongooseService from '../databases/MongooseService'
import RedisService from '../databases/RedisService'
import API from '../API/API'
import UserService from '../serveces/UserService'
let server
let userId
describe('test the auth API', () => {
  beforeAll(async () => {
    await MongooseService.init()
    server = await API.init()
    RedisService.init()
  })

  afterAll(async () => {
    await UserService.deleteAll()
    await MongooseService.disconnect()
    await RedisService.disconnect()
    if (server) {
      server.close()
    }
  })

  // test register
  it('should register user and get token', async () => {
    const user = {
      email: 'gevorg@gmail.com',
      password: 'Ga123456'
    }

    const res = await request(server).post('/api/auth/register').send(user)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: true,
        result: expect.objectContaining({
          id: res.body.result.id,
          isEmailSend: res.body.result.isEmailSend,
          message: res.body.result.message
        })
      })
    )

    userId = res.body.result.id
  })

  // test verification
  it('should verify user email', async () => {
    const user = await UserService.findById(userId)

    const res = await request(server).put(
      `/api/auth/verify/${userId}/${user.verificationToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: true,
        result: expect.objectContaining({
          message: res.body.result.message
        })
      })
    )
  })

  // test login
  it('should authenticate user and get token', async () => {
    const user = {
      email: 'gevorg@gmail.com',
      password: 'Ga123456'
    }

    const res = await request(server).post('/api/auth/login').send(user)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: true,
        result: expect.objectContaining({
          userId: res.body.result.userId,
          email: res.body.result.email,
          token: res.body.result.token
        })
      })
    )
  })
})
