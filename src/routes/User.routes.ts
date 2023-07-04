import { Router } from "express"
import passport from "passport"
import asyncHandler from 'express-async-handler'
import UserController from "../controllers/UserController"
import { checkJwtAuth } from "../config/jwt/JwtAuth"

const usersRoute = Router()
const userController = new UserController()

usersRoute.post('/register', passport.authenticate('register'), asyncHandler(userController.register))
usersRoute.post('/login', passport.authenticate('login'), asyncHandler(userController.login))
usersRoute.post('/logout', asyncHandler(userController.logout))
usersRoute.get('/session', asyncHandler(userController.createSession))
usersRoute.get('/register-github', passport.authenticate('github', { scope: ['user:email'] }))
usersRoute.get('/profile-github', passport.authenticate('github', { scope: ['user:email'] }),asyncHandler(userController.profileGithub))

//JWT
usersRoute.post('/register-jwt', asyncHandler(userController.registerJwt))
usersRoute.post('/login-jwt', asyncHandler(userController.loginJwt))
usersRoute.get('/private-jwt', checkJwtAuth, asyncHandler(userController.privateJwt))
usersRoute.get('/jwt-test', passport.authenticate('jwt'), asyncHandler((req, res) => {
    res.send(req.user)
}))
usersRoute.get('/jwt-cookies', passport.authenticate('jwtCookies'), asyncHandler(userController.privateJwt))

//LOCAL-PASSPORT
// usersRoute.post('/register', passport.authenticate('register'), asyncHandler(async (req: any, res: Response,
//     next: NextFunction): Promise<any> => {
//     return res.status(201).json({
//         msg: `User ${req.user.email} created`
//     })
// }))
// usersRoute.post('/login', passport.authenticate('login'), asyncHandler(async (req: any, res: Response,
//     next: NextFunction): Promise<any> => {
//     return res.status(200).json({
//         data: `Bienvenido ${req.user.firstName}`
//     })
// }))

// GOOGLE
// usersRoute.get('/oauth2/redirect/accounts.google.com', passport.authenticate('google', { assignProperty: 'user' }),
//     asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<any> => {
//         const { firstName, lastName, email, role, isGoogle } = req.user
//         return res.json({
//             msg: 'Google Login OK',
//             session: req.session
//         })
//     }))

export default usersRoute
