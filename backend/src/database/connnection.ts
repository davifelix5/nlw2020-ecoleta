import knex from 'knex';
import path from 'path';

/*
ENTIDADES
points: ponto de coleta
    image
    name
    email
    whatsapp
    uf
    city
    address
        latitude
        longitude
    
items: item que podem ser coletados
    title
    image

Muitos para muitos: vários itens podem ser coletados por vários pontos

point_item: tabela de relação
    id do ponto de coleta - id do item
*/

const database = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    }
});

export default database;
