import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser'
import config from './config.js';
import errorHandler from './middlewares/ErrorHandler.js';

import { init as initPassportConfig } from './config/passport.config.js';


import indexRouter from './routers/api/index.router.js';
import indexJwtRouter from './routers/api/index.jwt.router.js';
import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'
import products from './routers/views/products.router.js';

import chatViewRouter from './routers/views/chat.router.js';
import cartViewRouter from './routers/views/carts.router.js';

import sessionsRouter from './routers/api/sessions.router.js';
import jwtRouter from './routers/api/jwt.router.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = dirname(__dirname);

const utilsDir = path.join(srcDir, 'utils');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const publicDir = path.join(utilsDir, '../public');
app.use(express.static(publicDir));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');

initPassportConfig();

app.use(passport.initialize());


app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/products', products);
app.use('/chat', chatViewRouter);
app.use('/cart', cartViewRouter);
app.use('/', indexRouter);
app.use('/api', sessionsRouter);
app.use('/auth', jwtRouter)

app.use(errorHandler);

export default app;