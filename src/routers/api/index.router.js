import { Router } from 'express';
import { verifyToken } from '../../helpers/utils.js';

const router = Router();

router.get('/profile',
    // privateRouter,
    (req, res) => {
        res.render('profile', { title: 'Perfil', user: req.user });
    });

router.get('/login',
    // publicRouters,
    (req, res) => {
        res.render('login', { title: 'Login' });
    });

router.get('/register',
    // publicRouters,
    (req, res) => {
        res.render('register', { title: 'Register' });
    });
router.get('/password-recovery',
    // publicRouters, 
    (req, res) => {
        res.render('password-recovery', { title: "Recuperar password" })
    })

router.get('/', (req, res) => {
    res.send('<h1>Hello People 😎!</h1>');
});

export default router;