import Knex from 'knex';

/*
A seed serve para popular a base de dados com informações pre definidas
*/

export async function seed(knex: Knex) {
    await knex('item').insert([
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Pilhas e baterias', image: 'baterias.svg' },
        { title: 'Papéis e papelão', image: 'papeis-papelao.svg' },
        { title: 'Resíduos eletrônicos', image: 'eletronicos.svg' },
        { title: 'Resíduos Orgânicos', image: 'orgânicos.svg' },
        { title: 'Óleo de cozinha', image: 'oleo.svg' },
    ]);
}
