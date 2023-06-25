import { Router } from "express"
import passport from "passport"
import asyncHandler from 'express-async-handler'
import UserController from "../controllers/UserController"
// import { generateToken, checkAuth } from "../config/jwt/JwtAuth"
// import UserService from "../services/UserService"
// const userService = UserService.getInstance()

const usersRoute = Router()
const userController = new UserController()

usersRoute.post('/register', passport.authenticate('register'), asyncHandler(userController.register))
usersRoute.post('/login', passport.authenticate('login'), asyncHandler(userController.login))
usersRoute.post('/logout', asyncHandler(userController.logout))
usersRoute.get('/session', asyncHandler(userController.createSession))
usersRoute.get('/register-github', passport.authenticate('github', { scope: ['user:email'] }))
usersRoute.get('/profile-github', passport.authenticate('github', { scope: ['user:email'] }),asyncHandler(userController.profileGithub))

export default usersRoute

//JWT
// usersRoute.post('/register-jwt', asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<any> => {
//     const { firstName, lastName, email, age, password } = req.body
//     const exist = await userService.findUser({ email })
//     if (exist) return res.status(400).json({ msg: 'user already exists'})
//     const user = { firstName, lastName, email, age, password }
//     const newUser = await userService.createUser(user)
//     const token = generateToken(newUser)

//     return res.status(201).json({
//         msg: `User ${newUser.firstName} created`,
//         token
//     })
// }))

// usersRoute.post('/login-jwt', asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<any> => {
//     const user = await userService.loginUser(req.body)
//     const acces_token = generateToken(user)
//     res.header('AUTH_TOKEN', acces_token).json({ msg: 'Login OK', acces_token })
// }))

// usersRoute.get('/private', checkAuth, asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<any> => {
//     return res.status(200).json({
//         status: 'OK',
//         user: req.user,
//     })
// }))

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
