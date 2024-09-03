/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex) => {
   await knex.schema.createTable('users_roles', (table) => {
    table.engine('InnoDB');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
    table.primary(['user_id', 'role_id']);
    table.unique(['user_id', 'role_id']);
   })
 };
 
 export const down = async (knex) => {
   await knex.schema.dropTable('users_roles');
 };