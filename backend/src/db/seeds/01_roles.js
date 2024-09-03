/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    {name: 'admin'},
    {name: 'user'}
  ]);
};
