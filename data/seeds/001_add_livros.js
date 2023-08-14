exports.seed = function (knex){
  return knex("financas").del()
  .then(function() {
      return knex("financas").insert([
          {
              tipo:"e", descricao: "Patrocínio: Red Bull", data: "2023-05-02", preco: 5000.00
          }
          

      ]);
  });
}

