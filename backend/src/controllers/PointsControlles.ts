import knex from '../database/connnection'
import { Request, Response } from 'express';

// index, show, create, delete, update

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query

        const parsedItems = String(items).split(',')
            .map(item => Number(item.trim()))

        const points = await knex('point')
            .join('points_items', 'point.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('point.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image: `http://192.168.0.105:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params

        const point = await knex('point').where('id', id).first();

        const serializedPoint = {
            ...point,
            image: `http://192.168.0.105:3333/uploads/${point.image}`
        }

        if (!point) {
            return response.status(404).json({ message: 'Point not found' })
        }


        const items = await knex('item')
            .join('points_items', 'item.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('item.title')

        return response.json({ point: serializedPoint, items: items })
    }

    async create(request: Request, response: Response) {

        const {
            name,
            email,
            whatsapp,
            uf,
            city,
            longitude,
            latitude,
            items
        } = request.body;

        // Faz uma query depender da outra
        // As que são chamados por trx só executam se todas derem certo
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            uf,
            city,
            longitude,
            latitude,
        }

        const trx = await knex.transaction()

        const inserted_ids = await trx('point').insert(point);

        const point_id = inserted_ids[0]

        const point_items = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            })

        await trx('points_items').insert(point_items)

        await trx.commit()

        return response.json({
            id: point_id,
            ...point,
        });
    }
}

export default PointsController
