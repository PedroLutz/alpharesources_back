/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('financas', (table)=> {
      table.increments();
      table.char("tipo").notNullable();
      table.string("descricao",60).notNullable();
      table.date("data").notNullable();
      table.decimal("preco",5.2).notNullable();
      table.string("area",60).notNullable();
    });
  };
  exports.down = function(knex) {
    return knex.schema.dropTable("financas");
  };
  