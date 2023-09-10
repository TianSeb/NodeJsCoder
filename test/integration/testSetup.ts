import dotenv from 'dotenv'
import request from 'supertest'
import Server from '../../src/Server'
import { initDbConnection } from '../../src/persistence/DbConnection'

dotenv.config()
const userEmail = process.env.TEST_EMAIL
const userPassword = process.env.TEST_PASSWORD
let server: Server
let token: string | null = null

beforeAll(async () => {
  await initDbConnection()
  server = new Server()
    const response = await request(server.getHttpServer())
      .post('/users/login')
      .send({
        email: userEmail,
        password: userPassword
      })

    if (response.status === 201) {
      token = response.body.data.accessToken
    }
  }
)

export async function getToken() {
  return token
}

export async function getServer() {
  return server
}
