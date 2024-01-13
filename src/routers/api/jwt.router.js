import { Router } from 'express';
// import 'dotenv/config';
// import UserManager from '../../dao/UserManager.js';
import UsersController from '../../controllers/users.controller.js';
import AuthController from '../../controllers/auth.controller.js';
import { userRepository } from '../../repositories/index.js';

import {
    createHash, isValidPassword,
    jwtAuth, tokenGenerator,
    verifyToken, authMiddleware
} from '../../helpers/utils.js'
import passport from 'passport';

const router = Router();


// aca va auth adelante de cada ruta
router.post('/login',
    async (req, res, next) => {
        const { email, password } = req.body;

        console.log('entrando a login ahora con jwt')
        // console.log(email)
        // console.log(password)
        try {
            // const user = await UsersController.getByMail(email)
            const user = await UsersController.get({ email })
            // console.log(user);


            if (user.length === 0) {
                // console.log('1')
                return res.status(401).json({ message: "Correo o password invalidos" })
            }
            const isPassValid = isValidPassword(password, user[0])
            if (!isPassValid) {
                // console.log('2')
                return res.status(401).json({ message: "Correo o password invalidos" })
            }

            const token = tokenGenerator(user[0]);
            // console.log('paso por aca')
            // res.status(200).json({ access_token: token })
            res
                .cookie('access_token',
                    token,
                    { maxAge: 1000 * 60 * 60, httpOnly: true })
                .status(200)
                // .json({ status: 'success' })
                .redirect('/products')
        } catch (error) {
            console.log(`Error ${error.message}`);
            next(error)
            // return res.status(500).json({ error: error.message })
        }
    })

router.post('/register',
    async (req, res, next) => {

        try {
            // console.log('entra')
            const { body } = req;

            // console.log("body", body)
            const newUser = await AuthController.register({
                ...body,
                password: createHash(req.body.password)
            });

            // console.log('newUser', newUser);
            return res.status(200).json({ status: 'success', message: 'User registered successfully' });
        } catch (error) {
            console.log(error.message)
            next(error)
        }
    });

router.get('/current',
    // jwtAuth,
    authMiddleware('jwt'), // aca le mando la estrategia que quiero usar, en este caso jwt
    async (req, res) => {
        // console.log(req.user);
        try {
            // console.log("entra a estrategia current")
            // console.log("req.user", req.user)

            const user = await userRepository.getCurrent(req.user.id)

            res.status(200).json(user)
            // console.log("user", user)
            // res.status(200).json(req.user)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    })

router.get('/cart',
    // jwtAuth,
    authMiddleware('jwt'), // aca le mando la estrategia que quiero usar, en este caso jwt
    async (req, res) => {
        // console.log(req.user);
        try {
            console.log("entra a estrategia current")
            console.log("req.user", req.user)

            // const user = await userRepository.getCurrent(req.user.id)

            res.status(200).json(req.user)
            // console.log("user", user)
            // res.status(200).json(req.user)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    })
router.get('/users',
    async (req, res, next) => {
        try {
            const users = await UsersController.get();
            res.status(200).json(users)
        } catch (error) {
            console.error("Error", error.message)
            next(error)
        }
    })

router.post('/password-recovery',
    async (req, res, next) => {
        const { email, newPassword } = req.body;

        try {
            const user = await UsersController.get({ email })

            if (!user) {
                return res.status(401).json({ message: "Correo o password invalidos" })
            }

            const updatedUser = await AuthController.resetPassword({ email, newPassword })

            return res.status(204).end()
        } catch (error) {
            next(error)
        }

    }
)

export default router;