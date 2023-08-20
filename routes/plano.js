const express = require("express");
const router = express.Router();
const dbKnex = require("../data/db_config"); 

//RETORNA TODAS AS FINANÇAS
router.get("/",async(req,res) => {
    try{
        const plano = await dbKnex("plano").orderBy("area");
        res.status(200).json(plano); //RETORNA CÓDIGO OK E OS DADOS
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});

//INSERIR NOVAS FINANÇAS
router.post("/",async (req,res)=>{
    const {area, recurso, tipo_a, valor_a, plano_a,
        data_limite, valor_b, tipo_b, plano_b} = req.body;
    if(!area || !recurso || !tipo_a || !valor_a || !plano_a ||
        !data_limite || !valor_b || !tipo_b || !plano_b){
        res.status(400).json({msg:"Preencha todos os campos"});
        return;
    }
    try{
        const novo = await dbKnex("plano")
        .insert({area,recurso,tipo_a,valor_a, plano_a,
        data_limite, valor_b, tipo_b, plano_b});
        res.status(201).json({id:novo[0]}); //CÓDIGO INDICA QUE A CRIAÇÃO FOI EFETUADA
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});

//ATUALIZAR VALOR DAS FINANÇAS
router.put("/:id",async(req,res) => {
    const id = req.params.id; 
    const {valor} = req.body; 
    try{
        await dbKnex("plano").update({valor}).where({id});
        res.status(200).json(); //CÓDIGO QUE INDICA FUNCIONAMENTO
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});


//DELETAR FINANÇA
router.delete("/:id",async(req,res) => {
    const {id} = req.params; 
    try{
        await dbKnex("plano").del().where({id});
        res.status(200).json(); //CÓDIGO QUE INDICA FUNCIONAMENTO
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e msg
    }
});

//BUSCAR POR PALAVRA NA DESCRICAO
router.get("/filtro/:palavra", async(req,res)=> {
    const palavra = req.params.palavra;r
    try{
            const financas = await dbKnex("plano")
            .where("recurso","like", `%${palavra}%`)
            res.status(200).json(financas); //CÓDIGO QUE INDICA FUNCIONAMENTO
        }catch(error){
            res.status(400).json({msg:error.message}); //retorna status de erro e msg
        }
});

module.exports = router;
