/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('plano', (table)=> {
      table.increments();
      table.string("area",60).notNullable();
      table.string("recurso",60).notNullable();
      table.char("tipo_a").notNullable();
      table.decimal("valor_a",5.2).notNullable();
      table.string("plano_a",300).notNullable();
      table.date("data_limite").notNullable();
      table.string("plano_b",300).notNullable();
      table.char("tipo_b").notNullable();
      table.decimal("valor_b",5.2).notNullable();
    });
  };
  exports.down = function(knex) {
    return knex.schema.dropTable("plano");
  };
  