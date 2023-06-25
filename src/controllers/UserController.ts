import { Request, Response, NextFunction } from "express"


export default class UserController {

    async register(req: any, res: Response, next: NextFunction): Promise<any> {
        return res.status(201).json({
            msg: `User ${req.user.email} created`
        })
    }

    async login(req: any, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: `Bienvenido ${req.user.firstName}`
        })
    }

    async logout(req: any, res: Response, next: NextFunction): Promise<any> {
        req.logOut((err: any) => {
            if (err) res.send({ status: 'Logout ERROR', body: err })
            res.send('Logout ok!')
        })
    }

    async createSession(req: any, res: Response, next: NextFunction): Promise<any> {
        return res.status(201).json({
            session: req.session
        })
    }

    async profileGithub(req: any, res: Response, next: NextFunction): Promise<any> {
        res.redirect('/')
        const { firstName, lastName, email, role, isGithub } = req.user
        return res.json({
            msg: 'Github Login OK',
            session: req.session,
            data: {
                firstName,
                lastName,
                email,
                role,
                isGithub
            }
        })
    }
}
