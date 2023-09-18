import dotenv from 'dotenv'
dotenv.config()

const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoDatabaseUrl: process.env.DB_MONGO_URL ?? 'no connection',
  socketUrl: process.env.SOCKET_URL,
  cookieSecret: process.env.COOKIE_SECRET ?? '12345789',
  jwtSecret: process.env.JWT_SECRET ?? '1234',
  jwtRefreshSecret: process.env.REFRESH_SECRET ?? '12345',
  accesTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION
}

export default config
