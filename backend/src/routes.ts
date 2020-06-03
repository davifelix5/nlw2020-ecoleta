import express from 'express';
import PointsController from './controllers/PointsControlles'
import ItemsController from './controllers/ItemsController'

const routes = express.Router();
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

routes.post('/point', pointsController.create)
routes.get('/point/:id', pointsController.show)
routes.get('/points', pointsController.index)

export default routes;
