import request from 'supertest'
import { getToken, getServer } from './testSetup'
import { UserModel } from '../../src/persistence/mongo/models/User'
import UserService from '../../src/services/UserService'

const userService: UserService = UserService.getInstance()
const userEmail: string = 'daber@mal.com'
const userPassword: string = '12345'
let server: any
let token: string | null = null

beforeAll(async () => {
  token = await getToken()
  server = await getServer()
  try {
    await UserModel.deleteOne({ email: userEmail })
  } catch (err: any) {
    console.log(err.msg)
  }
})

describe('User Controller', () => {
  let token: any
  let userId: any

  it('should create user and return status 201', async () => {
    const response = await request(server.getHttpServer())
      .post('/users/register')
      .send({
        firstName: 'Daber',
        lastName: 'Maul',
        email: userEmail,
        password: userPassword,
        age: 333
      })

    expect(response.status).toBe(201)
    expect(response.body.data.msg).toEqual(`User Daber created`)
  })

  it('should login and return token', async () => {
    const response = await request(server.getHttpServer())
      .post('/users/login')
      .send({
        email: userEmail,
        password: userPassword
      })

    expect(response.status).toBe(201)
    expect(response.body.data.msg).toEqual(`Login OK`)

    token = response.body.data.accessToken
    expect(token).toBeDefined()
  })

  it('should return userId when session', async () => {
    const response = await request(server.getHttpServer())
      .get('/users/session')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)
    userId = response.body.data.session._id
    expect(userId).toBeDefined()
    expect(response.body.data.session.role).toEqual('user')
  })

  it('should return user with Role changed to premium', async () => {
    const responseUserRole = await request(server.getHttpServer())
      .put('/users/premium/' + userId)
      .set('Authorization', `Bearer ${token}`)

    expect(responseUserRole.status).toBe(200)

    const updatedUser: any = await userService.findUserWithFilter({
      _id: userId
    })
    expect(updatedUser.role).toEqual('premium')
  })

  it('should logout and return status 200', async () => {
    const response = await request(server.getHttpServer()).post('/users/logout')

    expect(response.status).toBe(200)
    expect(response.body.data.status).toEqual('Logout ok!')
  })
})
