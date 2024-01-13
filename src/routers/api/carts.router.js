import { Router } from "express";
import CartManager from "../../dao/CartManager.js";
import CartController from "../../controllers/cart.controller.js"
import {authorizationMiddleware } from "../../helpers/utils.js";
import passport from "passport";

const router = Router();

router.get('/',
    async (req, res) => {
        const carts = await CartController.get();
        res.status(200).json(carts);
    });

router.get('/:cid',
    async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await CartController.getById(cid);
            res.status(200).json(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.post('/:cartId',
    // authMiddleware('jwt'),
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('user'),
    async (req, res) => {
        try {
            // console.log("req.user", req.user)
            // console.log('addproducttocart')
            const { cartId } = req.params
            const { productId, quantity } = req.body;
            const product = await CartController.addProductToCart(cartId, productId, quantity)
            res.status(201).json(product)
        } catch (error) {
            console.error(error.message)
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })
router.delete('/:cid/products/:pid',
    async (req, res, next) => {
        const { cid, pid } = req.params

        // console.log('entra a la ruta')
        try {
            const cart = await CartController.removeProductFromCart(cid, pid)
            res.status(200).send(cart)
        } catch (error) {
            next(error)
            // res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.delete('/:cid',
    async (req, res) => {
        const { cid } = req.params;
        // console.log('entra');
        try {
            const cart = await CartController.removeAllProductsFromCart(cid)
            res.status(201).send(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.put('/:cid',
    async (req, res) => {
        const { cid } = req.params;
        const products = req.body;
        // console.log("products", products);
        try {
            const cart = await CartController.updateProductsFromCart(cid, products)
            res.status(201).send(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.put('/:cid/products/:pid',
    async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await CartManager.updateProductQuantityFromCart(cid, pid, quantity)
            res.status(200).send(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }

    })

router.post('/:cid/purchase',
    async (req, res, next) => {
        const { cid } = req.params;

        try {
            const { user, productsWithoutStock, cart, ticket } = await CartController.createPurchase(cid)


            // console.log("updatedProducts", updatedProducts)
            res.status(200).json({
                user,
                productsWithoutStock,
                cart,
                ticket
            })
        } catch (error) {
            console.error("Error", error.message);
            next(error);
        }

    })


export default router;