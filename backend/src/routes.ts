import express from 'express';
import PointsController from './controllers/PointsControlles'
import ItemsController from './controllers/ItemsController'
import upload from './config/multer'

import { celebrate, Joi } from 'celebrate'

const routes = express.Router()

const pointsController = new PointsController()
const itemsController = new ItemsController()

/*
FUNCIONALIDADES WEB
Cadastro de pontos de coleta
Listagem de itens de coleta disponíveis

FUNCIONALIDADES MOBILE
Listagem de pontos filtrados por estado, cidade e itens
Identificar ponto de coleta específico
*/

routes.get('/items', itemsController.index)

routes.post(
    '/point',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            // Validar itens por regex
            items: Joi.string().required()
            // Validar imagem pelo file filter no multer
        })
    }, {
        abortEarly: false
    }),
    pointsController.create
)
routes.get('/point/:id', pointsController.show)
routes.get('/points', pointsController.index)

export default routes;
