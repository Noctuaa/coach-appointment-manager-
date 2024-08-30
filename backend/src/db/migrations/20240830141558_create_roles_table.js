/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex)  => {
   await knex.schema.createTable('roles', (table) => {
      table.increments('id').primary().notNullable();
      table.string('name', 191).notNullable().unique();
      table.timestamps(true, true);
   }).then(() => 
      knex.raw('ALTER TABLE roles ENGINE = InnoDB' 
   ));
};


export const down = async (knex) => {
   await knex.schema.dropTable('roles');
};