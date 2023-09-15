const express = require("express");
const router = express.Router();
const dbKnex = require("../data/db_config"); 

//RETORNA TODAS AS FINANÇAS
router.get("/",async(req,res) => {
    try{
        const financas = await dbKnex("financas").orderBy("data","desc");
        res.status(200).json(financas); //RETORNA CÓDIGO OK E OS DADOS
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});

//INSERIR NOVAS FINANÇAS
router.post("/",async (req,res)=>{
    const {tipo, descricao, data, preco, area, origem, destino} = req.body;
    if(!tipo || !descricao || !data || !preco || !area || !origem || !destino){
        res.status(400).json({msg:"Envie todas as informações requisitadas."});
        return;
    }
    try{
        const novo = await dbKnex("financas").insert({tipo,descricao,data,preco,area,origem,destino});
        res.status(201).json({id:novo[0]}); //CÓDIGO INDICA QUE A CRIAÇÃO FOI EFETUADA
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});

//ATUALIZAR VALOR DAS FINANÇAS
router.put("/:id",async(req,res) => {
    const id = req.params.id; 
    const {preco} = req.body; 
    try{
        const registro = await dbKnex("financas").select("tipo").where({ id }).first();

        if (!registro) {
            throw new Error("Registro não encontrado.");
        }

        let updatedPreco = preco;

        if (registro.tipo === "d") {
            updatedPreco = -Math.abs(preco); // Torna o valor negativo
        } else if (registro.tipo !== "e") {
            throw new Error("Tipo inválido na tabela. O tipo deve ser 'e' ou 'd'.");
        }

        await dbKnex("financas").update({preco: updatedPreco}).where({id});
        res.status(200).json(); //CÓDIGO QUE INDICA FUNCIONAMENTO
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});


//DELETAR FINANÇA
router.delete("/:id",async(req,res) => {
    const {id} = req.params; 
    try{
        await dbKnex("financas").del().where({id});
        res.status(200).json(); //CÓDIGO QUE INDICA FUNCIONAMENTO
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});

//BUSCAR POR PALAVRA NA DESCRICAO
router.get("/filtro/:palavra", async(req,res)=> {
    const palavra = req.params.palavra
    try{
            const financas = await dbKnex("financas")
            .where("descricao","like", `%${palavra}%`)
            res.status(200).json(financas); //CÓDIGO QUE INDICA FUNCIONAMENTO
        }catch(error){
            res.status(400).json({msg:error.message}); //retorna status de erro e msg
        }
});

//DADOS DE RESUMOS
router.get("/dados/resumo",async (req,res) =>{
    try{
        const financas = await dbKnex("financas")
        .select(dbKnex.raw('SUM(CASE WHEN tipo = "e" THEN preco ELSE 0 END) AS somaEntrada'))
        .select(dbKnex.raw('SUM(CASE WHEN tipo = "d" THEN preco ELSE 0 END) AS somaDespesa'))
        .count({num: "*"})
        .max({maior: "preco"})
        .avg({media: "preco"});
        const {num,somaEntrada,somaDespesa,maior,media} = financas[0];
        
        res.status(200).json({num,somaEntrada,somaDespesa,maior,media:Number(media.toFixed(2))});
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
})

//DADOS DO GRÁFICO MENSAL GANHOS
router.get("/dados/relatorioMensalGanhos",async (req,res) =>{
    try{
        const totalPorMês = await dbKnex("financas")
        .select(dbKnex.raw('strftime("%Y-%m", data) as mes'))
        .where("tipo", "=", "e")
        .sum({ total: "preco" })
        .groupBy("mes")
        .orderBy("mes");
        res.status(200).json(totalPorMês);//RETORNA CÓDIGO DE FUNCIONAMENTO E A QUERY
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
})

//DADOS DO GRÁFICO MENSAL GASTOS
router.get("/dados/relatorioMensalGastos",async (req,res) =>{
    try{
        const totalPorMês = await dbKnex("financas")
        .select(dbKnex.raw('strftime("%Y-%m", data) as mes'))
        .where("tipo", "=", "d")
        .sum({ total: "preco" })
        .groupBy("mes")
        .orderBy("mes");
        res.status(200).json(totalPorMês);//RETORNA CÓDIGO DE FUNCIONAMENTO E A QUERY
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
})

//DADOS DO GRÁFICO POR ÁREA (RECEBIDO)
router.get("/dados/relatorioAreaRecebido",async (req,res) =>{
    try{
        const totalPorMês = await dbKnex("financas")
        .select("area")
        .where("tipo", "=", "e")
        .sum({ total: "preco" })
        .groupBy("area")
        res.status(200).json(totalPorMês);//RETORNA CÓDIGO DE FUNCIONAMENTO E A QUERY
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
})

//DADOS DO GRÁFICO POR ÁREA (GASTO)
router.get("/dados/relatorioAreaGasto",async (req,res) =>{
    try{
        const totalPorMês = await dbKnex("financas")
        .select("area")
        .where("tipo", "=", "d")
        .sum({ total: "preco" })
        .groupBy("area")
        res.status(200).json(totalPorMês);//RETORNA CÓDIGO DE FUNCIONAMENTO E A QUERY
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
})

module.exports = router;
