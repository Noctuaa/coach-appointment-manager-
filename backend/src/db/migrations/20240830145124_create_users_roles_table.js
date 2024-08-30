/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex) => {
   await knex.schema.createTable('users_roles', (table) => {
     table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
     table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
     table.primary(['user_id', 'role_id']);
     table.unique(['user_id', 'role_id']);
   }).then(() => 
      knex.raw('ALTER TABLE users_roles ENGINE = InnoDB' 
   ));
 };
 
 export const down = async (knex) => {
   await knex.schema.dropTable('users_roles');
 };