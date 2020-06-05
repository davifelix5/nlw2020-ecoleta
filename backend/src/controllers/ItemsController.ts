import knex from '../database/connnection'
import { Request, Response } from "express";

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('item').select('*')
		
		const serializedItems = items.map(item => {
			return {
				id: item.id,
				image: `http://192.168.0.102:3333/uploads/${item.image}`,
				title: item.title,
			}
		})

        return response.json(serializedItems);
    }
}

export default ItemsController
