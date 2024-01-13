import { Router } from "express";
import ProductManager from "../../dao/ProductManager.js";
import { uploader } from "../../helpers/utils.js";
import passport from "passport";
import config from "../../config.js";
import ProductsController from "../../controllers/products.controller.js";
import { authorizationMiddleware } from "../../helpers/utils.js";
import { CustomError } from "../../helpers/CustomError.js";
import EnumsError from "../../helpers/EnumsError.js";
import { generatorProductError } from "../../helpers/CauseMessageError.js";
const router = Router();


const buildResponse = (data) => {
    return {
        status: "success",
        payload: data.docs.map(product => product.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.prevPage}` : '',
        nextLink: data.hasNextPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.nextPage}` : '',
    }
}

router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['user', 'admin']),
    async (req, res, next) => {
        try {
            const { page = 1, limit = 10, category, sort } = req.query;
            const options = {
                page,
                limit,
                sort: { price: sort || 'asc' }
            }
            // const options = { page, limit }
            const criteria = {};

            // console.log("entro aqui")
            if (category) {
                console.log("query", category)
                criteria.category = category;
            }
            const result = await ProductsController.get(criteria, options)

            res.status(200).json(result);

        } catch (error) {
            console.error(error.message)
            next(error);
        }
    })

router.get('/:pid',
    async (req, res) => {
        try {
            const { pid } = req.params;

            const product = await ProductsController.getById(pid);
            res.status(200).json(product);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.post('/mockingproducts',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res, next) => {
        const PRODUCTS_QUANTITY = 50
        try {
            await ProductsController.createFakeProduct(PRODUCTS_QUANTITY)

            res.redirect('/products')
        } catch (error) {
            console.error("Error: ", error.message)
            next(error);
        }
    })

router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    uploader.array('thumbnails', 4),
    async (req, res, next) => {
        const { body } = req;
        const { files } = req;
        // console.log('entra a la ruta');
        // console.log('Files:', req.files);
        const { title, description, code, price, stock, category } = req.body;

        try {
            if (!title || !description || !code || !price || !stock || !category) {
                console.log("title", title)
                CustomError.createError({
                    name: 'Error creando el producto',
                    cause: generatorProductError({
                        title, description, code, price, stock, category
                    }),
                    message: 'Ocurrio un error mientras intentamos crear un producto.',
                    code: EnumsError.BAD_REQUEST_ERROR,
                })
            }
            await ProductsController.create(body, files);
            res.redirect(`/products`)
        } catch (error) {
            next(error)
        }
        // res.status(201).json(product);

    });

router.put('/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        const { pid } = req.params;
        const { body } = req
        try {
            await ProductManager.updateById(pid, body)
            res.status(204).end();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.delete('/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        try {
            const { pid } = req.params;

            await ProductManager.deleteById(pid);
            res.status(204).end();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })



export default router;