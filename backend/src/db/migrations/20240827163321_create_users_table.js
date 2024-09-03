/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex) => {
   await knex.schema.createTable('users', (table) => {
      table.engine('InnoDB');
      table.increments('id').primary().notNullable();
      table.string('email', 191).notNullable().unique();
      table.string('password', 255).notNullable();
      table.timestamps(true, true);
   })
};


export const down = async (knex) => {
   await knex.schema.dropTable('users');
};